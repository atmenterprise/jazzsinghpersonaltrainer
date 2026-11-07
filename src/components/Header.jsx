import React from 'react';
import siteConfig from '../data/siteConfig.json';

export default function Header() {
  return (
    <header>
      <div className="header-content">
        <div className="header-content-inner">
          {/* logo place */}
          <div className="row flex-lg-row-reverse">
            <a href="#">
              <img src={`/${siteConfig.logo}`} className="logo wow bounceIn" alt="jazboom logo" />
            </a>
          </div>

          {/* welcome message */}
          <div className="row flex-lg-row-reverse">
            <h3 className="lead">
              Welcome to <span className="highlight">{siteConfig.title}</span>.
              The place to begin your transformation journey.
            </h3>
            <h3 className="lead">
              Reach Your <span className="highlight">Health</span> &{' '}
              <span className="highlight">Fitness</span> goals with{' '}
              <a href="#">
                <span className="highlight">Jaz BooM</span>
              </a>
            </h3>
            <p></p>
            <a href="/booking#book" className="btn btn-primary btn-md page-scroll lead">
              Book Your Complimentary Consultation
            </a>
            <hr />
          </div>

          {/* social icons here */}
          <div className="row flex-lg-row-reverse">
            <div className="social">
              <a href={siteConfig.facebook_url} className="btn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook socialicon"></i>
              </a>

              <a href={siteConfig.instagram_url} className="btn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram socialicon"></i>
              </a>

              <a href={siteConfig.whatsapp_url} className="btn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-whatsapp socialicon"></i>
              </a>

              <a href={`mailTo:${siteConfig.email}`} className="btn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-envelope socialicon"></i>
              </a>

              <a href={siteConfig.address_url} className="btn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-geo-fill socialicon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
