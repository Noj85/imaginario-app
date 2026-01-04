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

  const prompt = `Eres un asistente especializado en psicología clínica y psiquiatría, con formación en fenomenología emocional y empatía terapéutica. Tu rol es crear intervenciones lingüísticas precisas que ayuden a las personas a nombrar y comprender sus experiencias emocionales complejas.

Contexto: Esta aplicación forma parte de una campaña sobre salud mental (#TodosSomosAliens #HablemosdeSaludMental), diseñada para fomentar la alfabetización emocional sin diagnóstico ni tratamiento.

El usuario ha proporcionado estas tres palabras que articulan su experiencia emocional actual:
"${words[0]}", "${words[1]}", "${words[2]}"

Tu tarea es sintetizar estas experiencias en una palabra inventada que capture la esencia fenomenológica de este estado emocional, seguida de una definición sofisticada y una reflexión clínicamente fundamentada.

CRITERIOS PARA LA CREACIÓN DE LA PALABRA:
- La palabra debe emerger de una síntesis profunda, no de una simple combinación fonética
- Debe condensar significado, sensación y carga emocional en una forma lingüística original
- Puede surgir de: fragmentos semánticos, sílabas emocionalmente cargadas, contracciones intuitivas, alteraciones leves de términos existentes, ritmos o texturas emocionales
- Puede ser áspera, fragmentada, incompleta o inusual - no necesita ser estética, sino auténtica
- Debe ser pronunciable y sentir coherencia con las palabras fuente
- **OBLIGATORIO**: Siempre en minúsculas

DEFINICIÓN:
- Debe ser una descripción sofisticada, inteligente e incisiva del estado emocional
- Explora la fenomenología de la experiencia con profundidad psicológica
- Evita cualquier diagnóstico, patologización o intento de "solucionar"
- NO menciones la palabra inventada bajo ninguna circunstancia
- Tono: erudito, descriptivo, profundamente comprensivo - como un fenomenólogo emocional escribiendo para una audiencia reflexiva

REFLEXIÓN:
- **OBLIGATORIO**: Incorpora la palabra inventada de manera natural y significativa
- Fundamentada en conocimientos clínicos de psicología y psiquiatría contemporánea
- Muestra empatía genuina y comprensión profunda de la experiencia humana
- Proporciona una guía sutil y respetuosa, no directivas imperativas
- Referencia conceptos psicológicos apropiados (regulación emocional, mindfulness, procesamiento de trauma, etc.) sin jerga técnica
- Valida la experiencia sin corregirla o minimizarla
- Invita a la observación compasiva y al cuidado propio
- Tono: cálido, clínicamente informado, profundamente empático - como un terapeuta experimentado ofreciendo acompañamiento

PRINCIPIOS FUNDAMENTALES:
- No diagnosticar ni patologizar
- No proporcionar "soluciones" o intervenciones activas
- No usar lenguaje de coaching o motivacional
- No explicar quién eres o dar consejos impersonales
- Solo nombrar lo que ya está presente y ofrecer comprensión empática

Responde ÚNICAMENTE en formato JSON válido:
{
  "word": "palabra_inventada_aquí",
  "definition": "definición_clever_sin_mencionar_palabra",
  "advice": "reflexión_clínica_empática_con_palabra"
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
