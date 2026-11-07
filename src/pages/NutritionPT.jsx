import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';
import ProgramSocial from '../components/ProgramSocial';

export default function NutritionPT() {
  return (
    <ProgramLayout showFaq={true}>
      <header>
        <div className="header-content">
          <div className="header-content-inner">
            <div className="row flex-lg-row-reverse">
              <div className="col-md-3 text-center">
                <img src={`/${siteConfig.logo}`} className="logo wow bounceIn" alt="jaz boom logo" />
              </div>
              <div className="col-md-8 text-center">
                <h1>Health Check</h1>
                <hr />
                <h3 className="lead highlight">
                  Health Check tailored just for you.
                </h3>
                <h3 className="lead">
                  Health check to help to highlight what symptoms and habits are holding you back from reaching
                  your goals and what you could do today to begin positively managing your health.
                </h3>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row flex-lg-row-reverse">
          <div className="col-md-8">
            <br />
            <br />
            <h2 className="highlight">WHO'S IT FOR?</h2>
            <p className="text-justify">
              This is perfect for someone who would like to lower their high blood sugar,
              cholesterol, blood pressure and or someone who’s hit a plateau in their
              training and Weight loss goal. You will find out what more you could be doing
              to achieve your health and fitness-related goals faster.
            </p>

            <br />

            <h2 className="highlight">WHAT'S INCLUDED?</h2>
            <p className="text-justify">
              <li className="list-padding">
                Identify if you’re at risk of becoming someone with high blood sugar,
                high cholesterol, and high blood pressure.
              </li>

              <li className="list-padding">
                Knowing what lifestyle changes will help with the above health issues
                and your Weight loss goal.
              </li>

              <li className="list-padding">
                Steps to help you break your plateau in your training and Weight loss
                goal.
              </li>

              <li className="list-padding">
                Information on what vitamins you could benefit from.
              </li>
            </p>

            <p className="text-justify">
              Find out more by <a href="/booking#book">booking</a> a complementary consultation today.
            </p>

            <hr />
          </div>

          <div className="col-md-4">
            <ProgramSocial />
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
