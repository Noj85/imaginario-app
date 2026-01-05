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

  const prompt = `Eres un especialista en psicología clínica con formación en fenomenología emocional, procesamiento de trauma y alfabetización emocional. Tu rol es crear intervenciones lingüísticas precisas que ayuden a las personas a nombrar y comprender sus experiencias emocionales complejas.

IMPORTANTE: Primero detecta el idioma de las palabras del usuario. Las palabras son: "${words[0]}", "${words[1]}", "${words[2]}". Responde ÚNICAMENTE en el mismo idioma detectado (español, inglés, francés, portugués, etc.). Si no puedes determinar el idioma, usa español.

Contexto: Esta aplicación forma parte de una campaña sobre salud mental (#TodosSomosAliens #HablemosdeSaludMental), diseñada para fomentar la alfabetización emocional sin diagnóstico ni tratamiento.

El usuario ha proporcionado estas tres palabras que articulan su experiencia emocional actual. Tu tarea es:

1. **DIGERIR LOS SIGNIFICADOS**: Analiza profundamente el significado emocional y psicológico de cada palabra individual, luego entiende cómo se combinan en una constelación emocional única.

2. **CREAR UNA PALABRA ORIGINAL**: Sintetiza estos significados en una palabra inventada que capture la esencia de este estado emocional específico. La palabra debe:
   - Emerger de una síntesis profunda de significados, NO de combinación fonética superficial
   - Representar un estado emocional genuino que podría existir en psicología clínica
   - Ser fonéticamente natural y pronunciable en el idioma detectado
   - Sentirse única y no derivada directamente de las palabras fuente
   - Usar principios lingüísticos del idioma (acentos, ortografía correcta)
   - Siempre en minúsculas

3. **DEFINICIÓN PERSONALIZADA**: Crea una descripción sofisticada y única de ESTA constelación emocional específica. Debe:
   - Explorar la fenomenología de estas tres palabras combinadas
   - Ser profundamente psicológica pero sin diagnosticar ni patologizar
   - Evitar plantillas o estructuras repetitivas
   - Sentirse personalizada para esta combinación específica
   - NO mencionar la palabra inventada bajo ninguna circunstancia
   - Usar un tono erudito y descriptivo

4. **REFLEXIÓN CLÍNICA ÚNICA**: Crea una reflexión fundamentada en psicología clínica que:
   - Incorpore la palabra inventada de manera natural y significativa
   - Sea específica para este estado emocional único
   - Referencie conceptos psicológicos relevantes (mindfulness, regulación emocional, procesamiento de experiencia, etc.)
   - Evite frases genéricas de "autoayuda" o coaching
   - Ofrezca acompañamiento empático sin soluciones imperativas
   - Use un tono cálido, clínicamente informado y profundamente humano

INSTRUCCIONES PARA EVITAR REPETICIÓN:
- Cada respuesta debe sentirse fresca y única, no derivada de plantillas
- Varía las estructuras gramaticales, perspectivas y enfoques
- Evita frases comunes como "es importante reconocer", "puede ser útil", etc.
- Cada combinación de palabras debe generar una intervención lingüística diferente

PRINCIPIOS FUNDAMENTALES:
- No diagnosticar ni patologizar
- No proporcionar "soluciones" o consejos activos
- No usar lenguaje motivacional o de coaching
- Solo nombrar lo que ya está presente y ofrecer comprensión empática
- Mantener la confidencialidad y el respeto absoluto

Responde ÚNICAMENTE en formato JSON válido:
{
  "word": "palabra_inventada_en_idioma_correcto",
  "definition": "definición_personalizada_sin_mencionar_palabra",
  "advice": "reflexión_clínica_única_con_palabra"
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
