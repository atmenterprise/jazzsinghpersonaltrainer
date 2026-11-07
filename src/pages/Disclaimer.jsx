import React from 'react';
import siteConfig from '../data/siteConfig.json';
import ProgramLayout from '../components/ProgramLayout';

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
            <h2 className="highlight">DISCLAIMER</h2>
            <p>
              {siteConfig.title} strongly recommends that you consult your physician before starting any exercise or
              workout program. You must be in good physical and mental condition and able to participate in the
              exercises. You should be aware and understand that when participating in any exercises or exercise program,
              there is a possibility of physical injury.
            </p>
            <p>
              If you engage in any workout, exercise or workout programme, you agree that you do so at your own risk,
              are voluntarily participating in these activities, assume all risk of injury to yourself and agree to
              release and discharge Jaz from any and all risk of injury to yourself and agree to release and discharge{' '}
              {siteConfig.title} from any and all claims or causes of action, known or unknown, arising out of{' '}
              {siteConfig.title} negligence.
            </p>

            <br />
            <h2 className="highlight">IMAGE ATTRIBUTION DISCLAIMER</h2>
            <h3>Images from Unsplash</h3>
            <p>
              All the images are used based under the free creative license terms and agreements of the unsplash
              website. The photos on Unsplash are free to use and can be used for most commercial, personal projects,
              and for editorial use. However, appropriate credits are provided as below:
            </p>
            <p>
              <li>
                <b>Cover Page Image on the website Credit:</b> Photo by{' '}
                <a
                  href="https://unsplash.com/@visualsbyroyalz?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Anastase Maragos
                </a>{' '}
                on{' '}
                <a
                  href="https://unsplash.com/photos/topless-man-in-black-shorts-sitting-on-black-and-silver-barbell-9dzWZQWZMdE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unsplash
                </a>
              </li>
            </p>
            <p>
              <li>
                <b>Nutrition Page Image on the programs section of the website Credit:</b> Photo by{' '}
                <a
                  href="https://unsplash.com/@fishmac?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vitalii Pavlyshynets
                </a>{' '}
                on{' '}
                <a
                  href="https://unsplash.com/photos/assorted-fruits-and-vegetables-on-green-surface-kcRFW-Hje8Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unsplash
                </a>
              </li>
            </p>
            <h3>Personal Website Images</h3>
            <p>
              The images (other than that from Unsplash) are owned by {siteConfig.title} and is NOT free for use in
              other websites, applications or any third party software's. {siteConfig.title} holds the copyright license
              to use the images in their website.
            </p>
            <h3>Animated GIFs Credits</h3>
            <p>
              All the GIFs animated images used in the website are credited to the Flaticon website, used under the switch
              creative license usage. The list of credits are as below:
              <li>
                <a href="https://www.flaticon.com/free-animated-icons/strong" title="strong animated icons" target="_blank" rel="noopener noreferrer">
                  Strong animated icons created by Freepik - Flaticon
                </a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-animated-icons/gym" title="gym animated icons" target="_blank" rel="noopener noreferrer">
                  Gym animated icons created by Freepik - Flaticon
                </a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-animated-icons/exercise" title="exercise animated icons" target="_blank" rel="noopener noreferrer">
                  Exercise animated icons created by Freepik - Flaticon
                </a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-animated-icons/gym" title="gym animated icons" target="_blank" rel="noopener noreferrer">
                  Gym animated icons created by Freepik - Flaticon
                </a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-animated-icons/exercise" title="exercise animated icons" target="_blank" rel="noopener noreferrer">
                  Exercise animated icons created by Freepik - Flaticon
                </a>
              </li>
            </p>
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
