import React from 'react';
import siteConfig from '../data/siteConfig.json';

export default function ProgramSocial() {
  const links = [
    ['Facebook', 'facebook', siteConfig.facebook_url],
    ['Instagram', 'instagram', siteConfig.instagram_url],
    ['WhatsApp', 'whatsapp', siteConfig.whatsapp_url],
    ['Email Jaz', 'envelope', `mailto:${siteConfig.email}`],
  ];
  return (
    <div className="programme-booking-card">
      <h2>Book Your Complimentary Consultation Today.</h2>
      <a href="/booking#book" className="btn btn-primary btn-lg">Book Now &raquo;</a>
      <div className="programme-socials">
        {links.map(([label, icon, href]) => <a key={label} href={href} aria-label={label} {...(href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><i className={`bi bi-${icon}`} aria-hidden="true"></i></a>)}
      </div>
    </div>
  );
}
