import React from 'react';
import ProgramLayout from '../components/ProgramLayout';
import FAQ from '../components/FAQ';

export default function Faq() {
  return (
    <ProgramLayout>
      <main className="faq-page">
        <header className="detail-hero" aria-labelledby="faq-page-title">
          <div className="container faq-page-intro">
            <a href="/#programmes" className="detail-back"><span aria-hidden="true">←</span> All programmes</a>
            <h1 id="faq-page-title">Frequently Asked Questions</h1>
            <p>Find out more about personal training, online coaching and nutrition.</p>
          </div>
        </header>
        <div className="container faq-page-content">
          <FAQ />
          <div className="faq-page-cta">
            <h2>Your results begin with a complimentary consultation.</h2>
            <p>Find out more by booking your complimentary consultation today.</p>
            <div><a href="/booking#book" className="btn btn-primary btn-lg">Book Your Complimentary Consultation</a><a href="/#contact" className="btn btn-default">Contact Jaz</a></div>
          </div>
        </div>
      </main>
    </ProgramLayout>
  );
}
