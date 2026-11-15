import React from 'react';
import siteConfig from '../data/siteConfig.json';

export default function Header() {
  return (
    <header className="home-hero" aria-labelledby="hero-title">
      <div className="header-content hero-content">
        <div className="header-content-inner hero-inner">
          {/* logo place */}
          <div className="hero-brand">
            <a href="#page-top" className="hero-logo-link" aria-label="Jaz BooM Personal Training home">
              <img src={`/${siteConfig.logo}`} className="logo hero-logo" alt="jazboom logo" />
            </a>
          </div>

          {/* welcome message */}
          <div className="hero-message">
            <p className="hero-welcome">
              Welcome to <span className="highlight">{siteConfig.title}</span>.
              The place to begin your transformation journey.
            </p>
            <h1 id="hero-title" className="hero-title">
              Reach Your <span className="highlight">Health</span> &{' '}
              <span className="highlight">Fitness</span> goals with{' '}
              <a href="#">
                <span className="highlight">Jaz BooM</span>
              </a>
            </h1>
            <div className="hero-actions">
              <a href="/booking#book" className="btn btn-primary btn-lg page-scroll hero-cta">
                Book Your Complimentary Consultation
              </a>
              {/* social icons here */}
              <div className="hero-socials">
                <div className="social">
                  <a href={siteConfig.facebook_url} className="btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook socialicon"></i>
                  </a>

                  <a href={siteConfig.instagram_url} className="btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-instagram socialicon"></i>
                  </a>

                  <a href={siteConfig.whatsapp_url} className="btn" aria-label="Whatsapp" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-whatsapp socialicon"></i>
                  </a>

                  <a href={`mailto:${siteConfig.email}`} className="btn" aria-label="Email Jaz" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-envelope socialicon"></i>
                  </a>

                  <a href={siteConfig.address_url} className="btn" aria-label="Get directions" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-geo-fill socialicon"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
