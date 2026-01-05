import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

const SocialShare = ({ result }) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)

  if (!result) return null

  const appUrl = window.location.href

  // Crear el texto para compartir
  const shareText = `Mi palabra emocional es: ${result.word}
Significado: ${result.definition}

#TodosSomosAliens #HablemosdeSaludMental ${appUrl}`

  // Generar thumbnail cuando se genera la palabra
  useEffect(() => {
    if (result) {
      generateThumbnail()
    }
  }, [result])

  const generateThumbnail = async () => {
    try {
      // Esperar un poco para que el DOM se renderice completamente
      setTimeout(async () => {
        const element = document.querySelector('.result-card')
        if (element) {
          const canvas = await html2canvas(element, {
            backgroundColor: '#0F1111', // Color de fondo de la app
            scale: 2, // Alta resolución
            useCORS: true,
            allowTaint: true,
            width: 600,
            height: 400
          })

          const imageUrl = canvas.toDataURL('image/png')
          setThumbnailUrl(imageUrl)

          // Actualizar meta tags dinámicamente
          updateMetaTags(imageUrl)
        }
      }, 500)
    } catch (error) {
      console.error('Error generando thumbnail:', error)
    }
  }

  const updateMetaTags = (imageUrl) => {
    // Actualizar Open Graph tags
    const updateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`) ||
                  document.querySelector(`meta[name="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(property.includes('og:') ? 'property' : 'name', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    updateMeta('og:title', `Mi palabra emocional: ${result.word}`)
    updateMeta('og:description', result.definition.substring(0, 160) + '...')
    updateMeta('og:image', imageUrl)
    updateMeta('og:url', appUrl)

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', `Mi palabra emocional: ${result.word}`)
    updateMeta('twitter:description', result.definition.substring(0, 160) + '...')
    updateMeta('twitter:image', imageUrl)
  }

  // Funciones para compartir en cada plataforma
  const shareToFacebook = () => {
    // Crear URL de Facebook con parámetros correctos
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`

    // También intentar con la nueva API de Facebook
    const altFacebookUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`

    // Usar la URL alternativa si la primera no funciona
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${appUrl}`)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToTikTok = () => {
    // Descargar la imagen generada
    downloadImage()

    // También copiar el texto al clipboard como respaldo
    navigator.clipboard.writeText(`${shareText}\n\n${appUrl}`).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
      // Abrir TikTok para que el usuario pueda subir la imagen descargada
      setTimeout(() => {
        window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer')
      }, 500)
    }).catch(() => {
      window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer')
    })
  }

  const shareToInstagram = () => {
    // Descargar la imagen generada
    downloadImage()

    // También copiar el texto al clipboard como respaldo
    navigator.clipboard.writeText(`${shareText}\n\n${appUrl}`).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
      // Abrir Instagram para que el usuario pueda subir la imagen descargada
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
      }, 500)
    }).catch(() => {
      // Fallback: abrir Instagram
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${appUrl}`).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
    })
  }

  // Función para descargar la imagen generada
  const downloadImage = () => {
    if (!thumbnailUrl) {
      console.warn('No hay imagen generada para descargar')
      return
    }

    const link = document.createElement('a')
    link.href = thumbnailUrl
    link.download = `mi-palabra-emocional-${result.word.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="social-share-section">
      <h3 className="share-title">Comparte tu palabra</h3>
      <div className="social-buttons">
        <button
          onClick={shareToInstagram}
          className="social-button instagram"
          aria-label="Compartir en Instagram"
          title="Copiar texto para Instagram"
        >
          <img
            src="/images/socials/instagram.png"
            alt="Instagram"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>📸</span>
          {copySuccess && <span className="copy-feedback">¡Copiado!</span>}
        </button>

        <button
          onClick={shareToFacebook}
          className="social-button facebook"
          aria-label="Compartir en Facebook"
          title="Compartir en Facebook"
        >
          <img
            src="/images/socials/facebook.png"
            alt="Facebook"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>📘</span>
        </button>

        <button
          onClick={shareToTwitter}
          className="social-button twitter"
          aria-label="Compartir en Twitter/X"
          title="Compartir en Twitter/X"
        >
          <img
            src="/images/socials/x.png"
            alt="X (Twitter)"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>🐦</span>
        </button>

        <button
          onClick={shareToWhatsApp}
          className="social-button whatsapp"
          aria-label="Compartir en WhatsApp"
          title="Compartir en WhatsApp"
        >
          <img
            src="/images/socials/whatsapp.png"
            alt="WhatsApp"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>💬</span>
        </button>

        <button
          onClick={shareToTikTok}
          className="social-button tiktok"
          aria-label="Compartir en TikTok"
          title="Copiar texto para TikTok"
        >
          <img
            src="/images/socials/tiktok.png"
            alt="TikTok"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>🎵</span>
          {copySuccess && <span className="copy-feedback">¡Copiado!</span>}
        </button>

        <button
          onClick={copyToClipboard}
          className="social-button copy-link"
          aria-label="Copiar enlace"
          title="Copiar enlace"
        >
          <img
            src="/images/socials/copyurl.png"
            alt="Copiar enlace"
            className="social-icon"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="emoji-fallback" style={{ display: 'none' }}>🔗</span>
          {copySuccess && <span className="copy-feedback">¡Copiado!</span>}
        </button>
      </div>
      <p className="share-description">
        Comparte para que más personas encuentren su palabra emocional
      </p>
    </div>
  )
}

export default SocialShare
