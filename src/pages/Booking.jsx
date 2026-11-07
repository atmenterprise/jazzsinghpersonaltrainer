import React, { useEffect } from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';

export default function Booking() {
  useEffect(() => {
    // Load Calendly script for inline widget
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <ProgramLayout showFaq={false}>
      <header>
        <div className="header-content">
          <div className="header-content-inner">
            <div className="row flex-lg-row-reverse">
              <div className="col-md-3 text-center">
                <img src={`/${siteConfig.logo}`} className="logo wow bounceIn" alt="jazboom logo" />
              </div>
              <div className="col-md-8 text-center">
                <h1>Booking</h1>
                <hr />
                <h3 className="lead highlight">
                  A simple process to enable you to book a free consultation with me.
                </h3>
                <a
                  href="#book"
                  className="page-scroll btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('book');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Today
                </a>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row flex-lg-row-reverse text-center">
          <br />
          <h2 className="section-heading text-center highlight" id="book">
            Booking Process
          </h2>
          <hr />
          <p className="lead">Select a suitable date and time for you from the available slots from the calendar.</p>
          <p className="muted">
            During your 15 minute phone call appointment I will try to understand your goals and help you plan the
            next steps of your journey to reaching your goals.
          </p>
          <br />

          {/* adding calendly feature */}
          <div className="col-sm-12">
            <div
              className="calendly-inline-widget"
              data-url={siteConfig.calendy_url}
              style={{ minWidth: '320px', height: '700px' }}
            ></div>
          </div>
        </div>
        <hr />
      </div>
    </ProgramLayout>
  );
}
