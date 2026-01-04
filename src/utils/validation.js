/**
 * Valida que una palabra tenga contenido válido
 * @param {string} word - La palabra a validar
 * @returns {boolean} true si la palabra es válida
 */
export const isValidWord = (word) => {
  return word && word.trim().length > 0
}

/**
 * Valida que todas las palabras en un array sean válidas
 * @param {string[]} words - Array de palabras a validar
 * @returns {boolean} true si todas las palabras son válidas
 */
export const areAllWordsValid = (words) => {
  return words.every(word => isValidWord(word))
}

/**
 * Limpia y normaliza una palabra
 * @param {string} word - La palabra a normalizar
 * @returns {string} Palabra normalizada
 */
export const normalizeWord = (word) => {
  return word.trim().toLowerCase()
}
