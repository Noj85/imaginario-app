import React from 'react'

const AlienImage = () => {
  return (
    <div className="alien-container">
      <img
        src="/images/alien.png"
        alt="Alien representando la campaña #TodosSomosAliens"
        className="alien-image"
        onError={(e) => {
          // Fallback si la imagen no existe
          e.target.style.display = 'none'
          console.log('Imagen del alien no encontrada. Se ocultará automáticamente.')
        }}
      />
    </div>
  )
}

export default AlienImage
