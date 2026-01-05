import React from 'react'

const ShareableImage = ({ result }) => {
  if (!result) return null

  // Truncar la definición si es muy larga (máximo 120 caracteres para que quepa bien)
  const truncatedDefinition = result.definition.length > 120
    ? result.definition.substring(0, 117) + '...'
    : result.definition

  return (
    <div className="shareable-image-container">
      {/* Background con blur */}
      <div className="shareable-background">
        {/* Card principal */}
        <div className="shareable-card">
          {/* Palabra - sin gradiente, alineada a la izquierda */}
          <div className="shareable-word">
            {result.word}
          </div>

          {/* Definición - truncada con ellipsis, alineada a la izquierda */}
          <div className="shareable-definition">
            {truncatedDefinition}
          </div>
        </div>

        {/* Logo y hashtags fuera del card - parte inferior */}
        <div className="shareable-footer">
          <div className="shareable-logo">
            <img
              src="/images/losimaginarios.png"
              alt="Los Imaginarios"
              className="shareable-logo-image"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div className="shareable-hashtags">
            #TodosSomosAliens #HablemosdeSaludMental
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareableImage
