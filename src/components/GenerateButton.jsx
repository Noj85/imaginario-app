import React from 'react'

const GenerateButton = ({ onClick, disabled, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`generate-button ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          Nombrándolo...
        </>
      ) : (
        'Nombrarlo'
      )}
    </button>
  )
}

export default GenerateButton
