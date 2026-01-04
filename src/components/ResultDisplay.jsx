import React from 'react'

const ResultDisplay = ({ result, onReset }) => {
  if (!result) return null

  return (
    <section className="result-section">
      <div className="result-card">
        <div className="word-display">
          <h2 className="generated-word">{result.word}</h2>
        </div>

        <div className="definition-section">
          <h3>QUÉ ES</h3>
          <p className="definition">{result.definition}</p>
        </div>

        <div className="advice-section">
          <h3>PARA ACOMPAÑARTE</h3>
          <p className="advice">{result.advice}</p>
        </div>

        <button onClick={onReset} className="reset-button">
          Nombrar otra
        </button>
      </div>
    </section>
  )
}

export default ResultDisplay
