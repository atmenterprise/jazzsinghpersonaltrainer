import React from 'react';
import siteConfig from '../data/siteConfig.json';

export default function ProgramSocial() {
  return (
    <div className="row">
      <br />
      <br />
      <br />
      <p className="lead text-center">
        Book Your Complimentary Consultation Today.
      </p>
      <hr />
      <p className="text-center">
        <a href="/booking#book" className="btn btn-primary btn-lg page-scroll lead">
          Book Now &raquo;
        </a>
      </p>
      <br />
      <div className="social text-center">
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
      </div>
    </div>
  );
}
