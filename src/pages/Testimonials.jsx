import React from 'react';
import siteConfig from '../data/siteConfig.json';
import testimonials from '../data/testimonials.json';
import ProgramLayout from '../components/ProgramLayout';

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

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <br />
            {testimonials.map((t) => (
              <div className="row text-justify thumbnail" key={t.id}>
                <div className="col">
                  <h5 className="panel-header lead highlight text-center">{t.testimonial.title}</h5>
                  <hr />
                  <div className="panel-body">
                    <p className="fontblack text-center">
                      Testimonial By: <span className="highlight">{t.testimonial.author}</span>
                      <span className="text-muted">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                      <a
                        href={t.testimonial.link || siteConfig.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-instagram fa-x"></i>
                      </a>
                    </p>

                    <p className="wrap has-dropcap text-muted text-justify" style={{ whiteSpace: 'pre-line' }}>
                      {t.testimonial.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
