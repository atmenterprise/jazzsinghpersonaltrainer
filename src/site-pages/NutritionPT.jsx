import React from 'react';
import ProgramDetail from '../components/ProgramDetail';

export default function NutritionPT() {
  const sections = [
    {
      id: 'who-its-for',
      title: "WHO'S IT FOR?",
      content: (<>
<p className="text-justify">
              This is perfect for someone who would like to lower their high blood sugar,
              cholesterol, blood pressure and or someone who’s hit a plateau in their
              training and Weight loss goal. You will find out what more you could be doing
              to achieve your health and fitness-related goals faster.
            </p>
      </>),
    },
    {
      id: 'whats-included',
      title: "WHAT'S INCLUDED?",
      content: (<>
<ul className="programme-inclusions">
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
            </ul>

            <p className="text-justify">
              Find out more by <a href="/booking#book">booking</a> a complementary consultation today.
            </p>
      </>),
    },
  ];

  return <ProgramDetail
    title='Health Check'
    introduction={<>
<p className="lead highlight">
                  Health Check tailored just for you.
                </p>
                <p className="lead">
                  Health check to help to highlight what symptoms and habits are holding you back from reaching
                  your goals and what you could do today to begin positively managing your health.
                </p>
    </>}
    sections={sections}
  />;
}
