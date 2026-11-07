import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';
import ProgramSocial from '../components/ProgramSocial';

export default function CouplePT() {
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
                <h1>2:1 Personal Training</h1>
                <hr />
                <h3 className="lead">
                  Share all the benefits of one to one personal training.
                  <br />
                  Fun fact, studies have shown that exercising with a friend or family member
                  can increase calories burned by up to 25%.
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
              If you have a common health and fitness related goal and can workout at the
              same time, then this is a great way to share the experience of personal training
              and achieve your goals in a faster time frame.
            </p>
            <p className="text-justify">
              Whether you both have the same experience in the gym or not, you'll still be
              individually supported to reach your respective goals as you train together.
            </p>
            <p className="text-justify">
              You are less likely to quit the process early or put less effort into your workouts
              as their will be a little friendly competition to each session.
            </p>

            <br />

            <h2 className="highlight">WHAT'S INCLUDED?</h2>
            <p className="text-justify">
              <li className="list-padding">
                Receive a personalised nutrition plan while trying to keep your lifestyle
                in mind all while increasing your nutrition knowledge and promoting
                healthy eating habits.
              </li>
              <li className="list-padding">
                Nutrition plan adjustments because these will be essential as your
                progress will slow down the more bodyfat you drop.
              </li>
              <li className="list-padding">
                Training plan designed relative to your goal and starting place to help
                you gain more confidence and experience in the gym while boosting
                activity outside the gym.
              </li>
              <li className="list-padding">
                Training plan adjustments for continued progress by breaking plateaus.
              </li>
              <li className="list-padding">
                Regular tracking and reviews of progress with feedback and actions for
                weeks ahead.
              </li>
              <li className="list-padding">
                Photos, scales and how you feel will be used to measure progress.
              </li>
            </p>

            <br />

            <h2 className="highlight">THE RESULTS YOU CAN EXPECT</h2>
            <p className="text-justify">
              If you are both willing to commit 100% to the process by working hard, staying
              consistent, remaining patient, asking questions, and applying feedback then
              you will both achieve results whatever your age, ability or starting point.
            </p>
            <p className="text-justify">
              I will deliver improvements across the board in your weight, body fat, body
              tone, posture, physical strength and fitness, and performance. You will also
              feel the difference in measures such as mood, stress, sleep, digestion,
              confidence, and energy.
            </p>

            <br />

            <h2 className="highlight">YOUR INVESTMENT</h2>
            <p className="text-justify">
              Minimise the cost by splitting the payments between yourselves and have a
              real return on your investment because I’m invested in you achieving your
              goals. Receive help over every hurdle and gain the knowledge of how to avoid
              them in future.
            </p>
            <p className="text-justify">
              Sessions will be 60 minutes long in which I will show you both how to safely use a
              variety of gym equipment, helping you reduce your dependency in the gym.
            </p>
            <p className="text-justify">
              Benefit as many couples, friends, and family members before you by beginning
              your results driven programme with the option to extend your programme.
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
