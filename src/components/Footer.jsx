import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../data/siteConfig.json';
import PolicyModal from './PolicyModal';

export default function Footer({ hideBookingBadge = false }) {
  const [policy, setPolicy] = useState(null);

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: siteConfig.facebook_url },
    { name: 'Instagram', icon: 'instagram', url: siteConfig.instagram_url },
    { name: 'WhatsApp', icon: 'whatsapp', url: siteConfig.whatsapp_url },
    { name: 'Email Jaz', icon: 'envelope', url: `mailto:${siteConfig.email}` },
    { name: 'Get directions', icon: 'geo-alt', url: siteConfig.address_url },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="/" className="footer-brand-link">
              <img src={`/${siteConfig.logo}`} alt="" width="72" height="72" loading="lazy" />
              <span>{siteConfig.title}</span>
            </a>
            <p>The place to begin your transformation journey.</p>
            <div className="footer-socials" aria-label="Social and contact links">
              {socialLinks.map(({ name, icon, url }) => (
                <a key={name} href={url} aria-label={name} {...(url.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <i className={`bi bi-${icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <h2>Explore</h2>
            <a href="/#about">About me</a>
            <a href="/#programmes">Programmes</a>
            <a href="/testimonials">Success stories</a>
            <a href="/faq">FAQs</a>
          </nav>
          <div className="footer-booking">
            <h2>Take your next step</h2>
            <p>Book your complimentary consultation.</p>
            <a href="/booking#book" className="btn btn-primary">Book now <span aria-hidden="true">↗</span></a>
            <a href="/#contact" className="footer-contact-link">Contact Jaz</a>
          </div>
        </div>
        <nav className="footer-legal" aria-label="Legal and privacy">
          <button type="button" onClick={() => setPolicy('disclaimer')}>Disclaimer</button>
          <button type="button" onClick={() => setPolicy('privacy')}>Privacy &amp; GDPR policy</button>
        </nav>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} <a href="/">{siteConfig.title}</a>. All rights reserved.</p>
          <p>Website designed by <a href={siteConfig.developer_webpage} target="_blank" rel="noopener noreferrer">{siteConfig.developer_name}</a></p>
        </div>
      </div>
      {!hideBookingBadge && <Link to="/booking#book" className="floating-booking" aria-label="Schedule time with Jaz — book your complimentary consultation">
        <i className="bi bi-calendar3" aria-hidden="true"></i>
        <span className="floating-action-label" aria-hidden="true">Schedule time with me</span>
      </Link>}
      {policy && <PolicyModal policy={policy} onClose={() => setPolicy(null)} />}
    </footer>
  );
}
