import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';
import PrivacyContent from '../components/PrivacyContent';

export default function Privacy() {
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
                <h1>Privacy & GDPR</h1>
                <hr />
                <h3 className="lead">
                  The privacy and GDPR rule that this website abides by. Please read the below statement for more
                  details.
                </h3>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row flex-lg-row-reverse">
          <div className="col-md-12">
            <br />
            <br />
            <PrivacyContent />
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
