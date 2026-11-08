import React from 'react';
import siteConfig from '../data/siteConfig.json';
import testimonials from '../data/testimonials.json';
import ProgramLayout from '../components/ProgramLayout';
import TestimonialCard from '../components/TestimonialCard';

export default function Testimonials() {
  return (
    <ProgramLayout showFaq={false}>
      <header>
        <div className="header-content">
          <div className="header-content-inner">
            <div className="row flex-lg-row-reverse">
              <div className="col-md-3 text-center">
                <img src={`/${siteConfig.logo}`} className="logo wow bounceIn" alt="jaz boom logo" />
              </div>
              <div className="col-md-8 text-center">
                <h1>Client Success Stories</h1>
                <hr />
                <h3 className="lead">
                  Hear from my clients their own success stories over the years and how I have helped them achieve their
                  goals.
                </h3>
                <p className="lead text-center">Book Your Complimentary Consultation Today with me.</p>
                <p className="text-center">
                  <a href="/booking#book" className="btn btn-primary btn-lg lead">
                    Book Today &raquo;
                  </a>
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="stories-section" aria-label="Client testimonials">
        <div className="container">
          <div className="stories-grid">
            {testimonials.map((entry) => <TestimonialCard key={entry.id} entry={entry} />)}
          </div>
          <div className="stories-cta">
            <h2>Your results begin with a complimentary consultation.</h2>
            <a href="/booking#book" className="btn btn-primary btn-lg">Book Today &raquo;</a>
          </div>
        </div>
      </section>
    </ProgramLayout>
  );
}
