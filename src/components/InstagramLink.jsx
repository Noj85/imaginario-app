import React from 'react'

const InstagramLink = () => {
  return (
    <footer className="instagram-footer">
      <a
        href="https://www.instagram.com/losimaginariosfilm/"
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-link"
        aria-label="Síguenos en Instagram - Los Imaginarios"
      >
        <img
          src="/images/socials/instagram.png"
          alt="Instagram"
          className="instagram-icon-img"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'inline'
          }}
        />
        <span className="instagram-icon-fallback" style={{ display: 'none' }}>📸</span>
        <span className="instagram-text">@losimaginariosfilm</span>
      </a>
    </footer>
  )
}

export default InstagramLink
