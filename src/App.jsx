import React, { useState } from 'react'
import WordInputs from './components/WordInputs'
import GenerateButton from './components/GenerateButton'
import ResultDisplay from './components/ResultDisplay'
import SupportLogos from './components/SupportLogos'
import { generateEmotionalWord } from './services/aiService'

function App() {
  const [words, setWords] = useState(['', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentState, setCurrentState] = useState('express') // 'express' | 'reflection'
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleWordsChange = (newWords) => {
    setWords(newWords)
    setError(null)
  }

  const handleGenerate = async () => {
    if (words.some(word => word.trim().length === 0)) {
      setError('Por favor, completa las tres palabras antes de generar.')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const generatedResult = await generateEmotionalWord(words)
      setResult(generatedResult)
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentState('reflection') // Cambiar a estado de reflexión
        setIsTransitioning(false)
      }, 150)
    } catch (err) {
      // Mostrar el mensaje específico del error
      setError(err.message || 'Hubo un problema al generar tu palabra. Por favor, intenta de nuevo.')
      console.error('Error generating emotional word:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setWords(['', '', ''])
      setResult(null)
      setError(null)
      setCurrentState('express') // Volver al estado de expresión
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header presente en ambos estados */}
        <header className="header">
          <h1>El Imaginario</h1>
          <p className="subtitle">Tres palabras. Un estado emocional.</p>
          <p className="hashtags">#TodosSomosAliens #HablemosdeSaludMental</p>
        </header>

        {/* Estado Express (Input) */}
        {currentState === 'express' && (
          <main className={`main ${isTransitioning ? 'state-exit-active' : 'state-enter-active'}`}>
            <section className="input-section">
              <h2>Ponle palabras a lo que sientes</h2>
              <p className="help-text">No hay respuestas correctas. Solo escribe lo que esté presente ahora.</p>

              <WordInputs
                words={words}
                onWordsChange={handleWordsChange}
              />

              <GenerateButton
                onClick={handleGenerate}
                disabled={words.some(word => word.trim().length === 0) || isLoading}
                isLoading={isLoading}
              />

              {error && <p className="error-message">{error}</p>}
            </section>
          </main>
        )}

        {/* Estado Reflection (Output) */}
        {currentState === 'reflection' && result && (
          <main className={`main ${isTransitioning ? 'state-enter-active' : 'state-enter-active'}`}>
            <ResultDisplay
              result={result}
              onReset={handleReset}
            />
          </main>
        )}

        {/* Sección de logos de apoyo - visible en ambos estados */}
        <SupportLogos />
      </div>
    </div>
  )
}

export default App
