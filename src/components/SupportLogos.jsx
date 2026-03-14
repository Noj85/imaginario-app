import React from 'react'

const SupportLogos = () => {
  // Array de logos de apoyo - fácilmente expandible para futuras alianzas
  const supportLogos = [
    { src: '/images/losimaginarios.png', alt: 'Los Imaginarios' },
    { src: '/images/piafproducciones.png', alt: 'Piaf Producciones' },
    { src: '/images/prosame.png', alt: 'Prosame' },
    { src: '/images/tuconsejeria.png', alt: 'Tu Consejería' },
  ]

  return (
    <section className="support-section">
      <p className="support-text">Con el apoyo de:</p>
      <div className="support-logos">
        {supportLogos.map((logo, index) => (
          <div key={index} className="support-logo-container">
            <img
              src={logo.src}
              alt={logo.alt}
              className="support-logo"
              onError={(e) => {
                // Fallback si el logo no se encuentra
                e.target.style.display = 'none'
                console.log(`Logo no encontrado: ${logo.src}`)
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SupportLogos
