import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';
import BookingCalendar from '../components/BookingCalendar';

export default function Booking() {
  return (
    <ProgramLayout hideBookingBadge>
      <main className="booking-page">
        <header className="booking-hero" aria-labelledby="booking-title">
          <div className="container booking-hero-inner">
            <div>
              <span className="section-eyebrow">Your next step starts here</span>
              <h1 id="booking-title">Booking</h1>
              <p>A simple process to enable you to book a free consultation with me.</p>
              <a href="#book" className="btn btn-primary btn-lg">Start Today <span aria-hidden="true">↓</span></a>
            </div>
            <img src={`/${siteConfig.logo}`} className="booking-logo" alt="Jaz BooM Personal Training" width="190" height="190" />
          </div>
        </header>
        <section className="booking-section" id="book" aria-labelledby="booking-process-title">
          <div className="container">
            <div className="booking-section-heading"><h2 id="booking-process-title">Booking Process</h2><hr className="primary" /><p>Select a suitable date and time for you from the available slots from the calendar.</p></div>
            <div className="booking-layout">
              <aside className="booking-consultation" aria-label="About your consultation">
                <span className="booking-label">Complimentary consultation</span>
                <h3>Let’s talk about your goals.</h3>
                <ul className="booking-facts"><li><i className="bi bi-clock" aria-hidden="true"></i><span>15 minutes</span></li><li><i className="bi bi-telephone" aria-hidden="true"></i><span>Phone call</span></li><li><i className="bi bi-check-circle" aria-hidden="true"></i><span>Free consultation</span></li></ul>
                <p>During your 15 minute phone call appointment I will try to understand your goals and help you plan the next steps of your journey to reaching your goals.</p>
                <div className="booking-help"><h4>Have a question first?</h4><a href="/faq">Frequently Asked Questions <span aria-hidden="true">↗</span></a><a href={`mailto:${siteConfig.email}`}>Email Jaz <span aria-hidden="true">↗</span></a></div>
              </aside>
              <div className="booking-calendar-card">
                <div className="booking-calendar-heading"><i className="bi bi-calendar3" aria-hidden="true"></i><div><h3>Choose your date &amp; time</h3><p>Schedule your consultation with Jaz.</p></div></div>
                <BookingCalendar />
              </div>
            </div>
            <p className="booking-privacy-note">Scheduling is provided by Calendly. Read our <a href="/privacy">Privacy &amp; GDPR policy</a> for information about booking data and cookies.</p>
          </div>
        </section>
      </main>
    </ProgramLayout>
  );
}
