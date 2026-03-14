import React from 'react'

const ShareableImage = ({ result }) => {
  if (!result) return null

  // Ajustar tamaño de fuente según longitud para que quepa la definición completa
  const getDefinitionFontSize = (length) => {
    if (length <= 100) return 38
    if (length <= 150) return 34
    if (length <= 200) return 30
    if (length <= 280) return 26
    if (length <= 400) return 22
    return 18
  }
  const definitionFontSize = getDefinitionFontSize(result.definition.length)

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

          {/* Definición completa - tamaño dinámico según longitud */}
          <div
            className="shareable-definition"
            style={{ fontSize: `${definitionFontSize}px` }}
          >
            {result.definition}
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
