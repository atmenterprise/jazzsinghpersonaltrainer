import React from 'react';
import ProgramDetail from '../components/ProgramDetail';

export default function OneToOnePT() {
  const sections = [
    {
      id: 'who-its-for',
      title: "WHO'S IT FOR?",
      content: (<>
<p className="text-justify">
              This is great for anyone who would like to follow a personalised programme to
              reach their health and fitness related goal faster.
            </p>
            <p className="text-justify">
              It is for someone who is unsure where to begin, have tried many times before
              and failed, or have stopped seeing any results in what they set out to achieve.
            </p>
            <p className="text-justify">
              You will benefit from having someone to be accountable to and help you’re
              training by teaching you the correct techniques for exercises and understand
              nutrition and how to apply it.
            </p>
      </>),
    },
    {
      id: 'whats-included',
      title: "WHAT'S INCLUDED?",
      content: (<>
<ul className="programme-inclusions">
              <li className="list-padding">
                Receive a personalised nutrition plan while trying to keep your lifestyle
                in mind all while increasing your nutrition knowledge and promoting
                healthy eating habits.
              </li>
              <li className="list-padding">
                Nutrition plan adjustments because these will be essential as your
                progress will slow down the more body fat you drop.
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
            </ul>
      </>),
    },
    {
      id: 'your-results',
      title: 'THE RESULTS YOU CAN EXPECT',
      content: (<>
<p className="text-justify">
              If you are willing to commit 100% to the process by working hard, staying
              consistent, remaining patient, and acting on feedback then you will achieve
              results whatever your age, ability and starting point.
            </p>
            <p className="text-justify">
              I will deliver improvements across the board in your weight, body fat, body
              tone, posture, physical strength and fitness, and performance. You will also
              feel the difference in measures such as mood, stress, sleep, digestion,
              confidence, and energy.
            </p>
      </>),
    },
    {
      id: 'your-investment',
      title: 'YOUR INVESTMENT',
      content: (<>
<p className="text-justify">
              Have a real return on your investment because I’m invested in you achieving
              your goal. Receive help over every hurdle while gaining the knowledge of how
              to avoid them in future.
            </p>
            <p className="text-justify">
              Sessions will be 60 minutes long in which I will show you how to safely use a
              variety of gym equipment, helping you reduce your dependency in the gym.
            </p>
            <p className="text-justify">
              Benefit as many before you by beginning your results driven programme which
              includes a structure of accountability to keep you on track with the option to
              extend your programme.
            </p>
            <p className="text-justify">
              Find out more by <a href="/booking#book">booking</a> a complementary consultation today.
            </p>
      </>),
    },
  ];

  return <ProgramDetail
    title='One to One Personal Training'
    introduction={<>
<p className="lead">
                  Working with a personal trainer helps you reach your goal faster while
                  teaching you how to independently sustain your results after the process is
                  complete.
                </p>
    </>}
    sections={sections}
  />;
}
