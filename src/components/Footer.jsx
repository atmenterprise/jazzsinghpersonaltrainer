import React, { useEffect } from 'react';
import siteConfig from '../data/siteConfig.json';

export default function Footer() {
  useEffect(() => {
    // Initialize Calendly badge widget
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      if (window.Calendly && typeof window.Calendly.initBadgeWidget === 'function') {
        window.Calendly.initBadgeWidget({
          url: siteConfig.calendy_url,
          text: 'Schedule time with me',
          color: '#0069ff',
          textColor: '#ffffff',
          branding: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="bg-dark">
      <div className="container">
        <h4 className="highlight text-center">{siteConfig.title.toUpperCase()}</h4>
        <h5 className="text-center text-muted">The place to begin your transformation journey</h5>
        <hr />
        <div className="row flex-lg-row-reverse text-center">
          <div className="social">
            <a href={siteConfig.facebook_url} className="btn" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook socialicon-sm"></i>
            </a>

            <a href={siteConfig.instagram_url} className="btn" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram socialicon-sm"></i>
            </a>

            <a href={siteConfig.whatsapp_url} className="btn" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp socialicon-sm"></i>
            </a>

            <a href={`mailTo:${siteConfig.email}`} className="btn" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-envelope socialicon-sm"></i>
            </a>

            <a href={siteConfig.address_url} className="btn" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-geo-fill socialicon-sm"></i>
            </a>
          </div>
        </div>
        <br />
        <div className="row text-center">
          <a href="/disclaimer">DISCLAIMER</a> |{' '}
          <a href="/privacy">PRIVACY POLICY</a> |{' '}
          <a href="/privacy">GDPR POLICY</a> |{' '}
          <a href="/onetoonept#faq">FAQs</a> |{' '}
          <a href="#" id="open_preferences_center">
            UPDATE COOKIES PREFERENCE
          </a>
        </div>
        <hr />
        <br />
        <br />
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-muted">
              &copy; COPYRIGHT 2026 &#8226; <a href="/">{siteConfig.title.toUpperCase()}</a> &#8226; ALL RIGHTS RESERVED.
            </h6>
          </div>
          <div className="col-md-6 text-right">
            <h6 className="text-muted">
              WEBSITE DESIGNED BY{' '}
              <a href={siteConfig.developer_webpage} target="_blank" rel="noopener noreferrer">
                {siteConfig.developer_name.toUpperCase()}
              </a>
            </h6>
          </div>
        </div>
      </div>

      {/* Calendly CSS */}
      <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
    </section>
  );
}
