import React from 'react';
import siteConfig from '../data/siteConfig.json';
import CookieDisclosure from './CookieDisclosure';

export default function DisclaimerContent() {
  return (
    <div className="policy-content">
      <h2 className="highlight">Website and training disclaimer</h2>
      <p>
        This notice explains how to use the information on {siteConfig.title}, including its
        training and nutrition information, client stories, third-party links and cookies.
      </p>
      <h3>Health, exercise and nutrition information</h3>
      <p>
        Information on this website is provided for general education about fitness, nutrition and
        wellbeing. It is not a medical diagnosis, prescription or a substitute for advice from a
        qualified healthcare professional. A programme should be appropriate to your health,
        experience and individual circumstances.
      </p>
      <p>
        Speak to your doctor or another appropriate healthcare professional before starting or changing
        an exercise or nutrition programme if you have a health condition, an injury, symptoms or
        concerns about whether an activity is suitable for you. Do not stop or change prescribed
        treatment because of information on this website.
      </p>
      <h3>Participation and individual results</h3>
      <p>
        Exercise involves physical effort and a risk of injury. Follow the guidance provided during
        your sessions, use suitable equipment and tell your trainer about relevant health conditions,
        injuries or changes in your circumstances. Stop an activity if you feel unwell or experience
        pain and seek appropriate help.
      </p>
      <p>
        Client testimonials describe individual experiences. Results vary with factors such as your
        starting point, health, consistency, nutrition and circumstances. A client’s experience or
        a result described on this website is not a guarantee that you will achieve the same outcome.
      </p>
      <h3>Website information and responsibility</h3>
      <p>
        We aim to keep website information accurate and useful, but it may change and may not cover
        every individual situation. Check current programme details and suitability during your
        consultation. Nothing in this notice excludes or limits liability that cannot lawfully be
        excluded or limits your statutory rights.
      </p>
      <h3>External links and shop offers</h3>
      <p>
        Booking, social media and shopping links may take you to services operated by other organisations.
        Their terms, privacy practices and availability are their responsibility. Product prices,
        promotions and discount eligibility can change; confirm the current offer and terms with the
        retailer before buying. A product link does not establish that a product is suitable for your
        individual health needs.
      </p>

      <h2 className="highlight">Cookies and website tracking</h2>
      <CookieDisclosure />

      <h2 className="highlight">Images and attribution</h2>
      <h3>AI-edited header image</h3>
      <p>
        The header background is an AI-edited scene based on reference photographs of Jaz.
        The client and training session are illustrative; the image is not a photograph of an
        actual client appointment or evidence of a client result.
      </p>
      <h3>Photographs and third-party artwork</h3>
      <p>
        Photographs of Jaz and training sessions are used as part of this website’s presentation.
        Other images, logos and artwork may belong to their respective owners. Their appearance on
        this website does not grant permission to copy, reuse or redistribute them.
      </p>
      <ul className="policy-credits">
        <li>
          Nutrition programme image credit:{' '}
          <a href="https://unsplash.com/@fishmac" target="_blank" rel="noopener noreferrer">Vitalii Pavlyshynets</a>{' '}
          on{' '}
          <a href="https://unsplash.com/photos/assorted-fruits-and-vegetables-on-green-surface-kcRFW-Hje8Y" target="_blank" rel="noopener noreferrer">Unsplash</a>.
        </li>
        <li>
          Animated icons credited to Freepik on Flaticon:{' '}
          <a href="https://www.flaticon.com/free-animated-icons/strong" target="_blank" rel="noopener noreferrer">strong</a>,{' '}
          <a href="https://www.flaticon.com/free-animated-icons/gym" target="_blank" rel="noopener noreferrer">gym</a>{' '}
          and{' '}
          <a href="https://www.flaticon.com/free-animated-icons/exercise" target="_blank" rel="noopener noreferrer">exercise icons</a>.
        </li>
      </ul>
      <h3>Questions about this notice</h3>
      <p>
        Contact {siteConfig.title} at{' '}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{' '}
        if you have a question about this disclaimer or the services described on this website.
      </p>
    </div>
  );
}
