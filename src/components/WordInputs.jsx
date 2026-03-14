import React from 'react'
import { isValidWord } from '../utils/validation'

const WordInputs = ({ words, onWordsChange }) => {
  const handleWordChange = (index, value) => {
    const newWords = [...words]
    newWords[index] = value
    onWordsChange(newWords)
  }

  const placeholder = 'Como te sientes en una palabra...'

  return (
    <div className="word-inputs">
      {words.map((word, index) => (
        <div key={index} className="input-group">
          <input
            type="text"
            value={word}
            onChange={(e) => handleWordChange(index, e.target.value)}
            placeholder={placeholder}
            className={`word-input ${isValidWord(word) ? 'valid' : ''}`}
            maxLength={50}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      ))}
    </div>
  )
}

export default WordInputs
