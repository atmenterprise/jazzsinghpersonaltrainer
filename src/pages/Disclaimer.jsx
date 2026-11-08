import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';
import DisclaimerContent from '../components/DisclaimerContent';

export default function Disclaimer() {
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
                <h1>DISCLAIMER</h1>
                <hr />
                <h3 className="lead">{siteConfig.title} disclaimer for all clients.</h3>
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
            <DisclaimerContent />
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
