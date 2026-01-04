import OpenAI from 'openai'

// Función para obtener la API key dinámicamente
const getApiKey = () => {
  // Primero intentar desde variables de entorno
  let apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Si no está disponible, intentar desde variable global del navegador
  if (!apiKey && typeof window !== 'undefined' && window.OPENAI_API_KEY) {
    apiKey = window.OPENAI_API_KEY
  }

  return apiKey
}

// Función para crear instancia de OpenAI cuando sea necesario
const createOpenAIClient = () => {
  const apiKey = getApiKey()

  if (!apiKey) {
    console.warn('⚠️ API Key de OpenAI no configurada.')
    console.warn('Soluciones:')
    console.warn('1. Crear archivo .env.local con: VITE_OPENAI_API_KEY=tu_clave')
    console.warn('2. En consola del navegador: window.OPENAI_API_KEY = "tu_clave"')
    return null
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Solo para desarrollo - en producción usar backend
  })
}

/**
 * Genera una palabra emocional, definición y consejo basado en tres palabras de entrada
 * @param {string[]} words - Array de tres palabras que describen el estado emocional
 * @returns {Promise<{word: string, definition: string, advice: string}>}
 */
// Función de espera para retry con backoff exponencial
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Función para retry con backoff exponencial
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Si es un error de quota (no temporal), no retry
      if (error.status === 429 && error.message.includes('quota')) {
        throw error
      }

      // Si no es el último intento y es un error retryable, esperar
      if (attempt < maxRetries && (error.status === 429 || error.status >= 500)) {
        const delay = baseDelay * Math.pow(2, attempt) // Backoff exponencial
        console.warn(`Intento ${attempt + 1} falló, reintentando en ${delay}ms...`)
        await wait(delay)
      }
    }
  }

  throw lastError
}

export const generateEmotionalWord = async (words) => {
  // Crear cliente OpenAI dinámicamente
  const openai = createOpenAIClient()

  if (!openai) {
    throw new Error('Servicio no disponible: La API key de OpenAI no está configurada. Opciones:\n1. Crea un archivo .env.local con VITE_OPENAI_API_KEY=tu_clave\n2. En la consola del navegador ejecuta: window.OPENAI_API_KEY = "tu_clave"')
  }

  if (!words || words.length !== 3) {
    throw new Error('Se requieren exactamente tres palabras')
  }

  if (words.some(word => !word.trim())) {
    throw new Error('Todas las palabras deben tener contenido')
  }

  const prompt = `Eres un asistente creativo y empático que ayuda a las personas a nombrar estados emocionales complejos.

Contexto: Esta aplicación es parte de una campaña sobre salud mental con el lema #TodosSomosAliens #HablemosdeSaludMental.

El usuario ha ingresado estas tres palabras que describen su estado emocional:
"${words[0]}", "${words[1]}", "${words[2]}"

Tu tarea es crear una palabra inventada que nombre este estado emocional combinado.

IMPORTANTE SOBRE LA CREACIÓN DE LA PALABRA:
- La palabra NO debe ser solo una suma fonética
- Debe ser una CONDENSACIÓN de significado, sensación y carga emocional
- Puede surgir de:
  * Fragmentos semánticos (no solo fonemas)
  * Sílabas cargadas emocionalmente
  * Contracciones intuitivas
  * Alteraciones leves de palabras reales
  * Ritmo, peso y textura emocional
- La palabra puede ser áspera, suave, rota o incompleta
- No tiene que sonar bonita, tiene que sentirse VERDADERA
- Debe ser pronunciable pero no necesariamente armónica
- Debe sentirse coherente con las palabras de origen

DEFINICIÓN:
- Explica qué nombra la palabra
- Describe la experiencia emocional
- NO diagnostiques, NO patologices, NO des soluciones
- Tono neutral, claro, descriptivo
- **OBLIGATORIO**: Usa la palabra inventada dentro del texto de la definición (ej: "Esta palabra, [palabra], nombra un estado donde...")

REFLEXIÓN:
- **OBLIGATORIO**: Usa la palabra inventada al menos una vez en el texto
- Valida la experiencia emocional
- Invita a la observación, no a la acción inmediata
- Sugiere cuidado sin imponerlo
- Evita imperativos fuertes, frases de coaching, promesas de mejora
- Tono: "Reconocer [palabra] puede ser un primer paso para mirarla con más calma"

FILOSOFÍA:
- No das respuestas
- No corriges emociones
- No explicas al usuario quién es
- Solo pones nombre a lo que ya estaba ahí

Responde ÚNICAMENTE en formato JSON válido:
{
  "word": "palabra_inventada_aquí",
  "definition": "definición_que_incluye_la_palabra_aquí",
  "advice": "reflexión_que_incluye_la_palabra_aquí"
}`

  try {
    const response = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8, // Creativo pero consistente
      })
    }, 3, 2000) // Máximo 3 reintentos, delay inicial de 2 segundos

    const content = response.choices[0]?.message?.content?.trim()

    if (!content) {
      throw new Error('No se recibió respuesta del servicio de IA')
    }

    // Intentar parsear el JSON
    let result
    try {
      result = JSON.parse(content)
    } catch (parseError) {
      // Si el JSON está malformado, intentar extraer información
      console.error('Error parsing JSON response:', parseError)
      throw new Error('La respuesta del servicio no tiene el formato esperado')
    }

    // Validar que tenga las propiedades requeridas
    if (!result.word || !result.definition || !result.advice) {
      throw new Error('La respuesta no contiene toda la información requerida')
    }

    return result

  } catch (error) {
    console.error('Error calling OpenAI API:', error)

    // Manejar errores específicos de rate limiting
    if (error.status === 429 || error.message.includes('429') || error.message.includes('RateLimitError')) {
      const isQuotaError = error.message.includes('quota') || error.message.includes('billing')
      if (isQuotaError) {
        throw new Error('Has excedido el límite de uso de tu cuenta de OpenAI. Revisa tu plan de facturación en https://platform.openai.com/account/billing')
      } else {
        throw new Error('Demasiadas solicitudes. Espera unos minutos antes de intentar nuevamente.')
      }
    }

    if (error.message.includes('API key')) {
      throw new Error('Configuración de API incompleta. Verifica tu clave de OpenAI.')
    }

    // Manejar otros errores de red/conexión
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.')
    }

    throw new Error('No se pudo generar la palabra emocional. Por favor, intenta de nuevo.')
  }
}
