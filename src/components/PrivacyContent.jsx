import React from 'react';
import siteConfig from '../data/siteConfig.json';
import CookieDisclosure from './CookieDisclosure';

export default function PrivacyContent() {
  return (
    <div className="policy-content privacy-policy-content">
      <p className="policy-updated">Last updated: 8 November 2026</p>
      <p>
        This Privacy &amp; GDPR policy explains how {siteConfig.title} uses information you share
        through this website, enquiries and appointment bookings. It also explains the website’s
        cookies, external services and your data protection rights.
      </p>
      <dl className="policy-summary">
        <div><dt>Your information</dt><dd>Contact details and information you choose to share when making an enquiry or using our services.</dd></div>
        <div><dt>Website services</dt><dd>Google Analytics measures website use. Calendly provides appointment scheduling.</dd></div>
        <div><dt>Your choices</dt><dd>Contact Jaz about your information, privacy requests or marketing preferences.</dd></div>
      </dl>

      <h2>Who to contact</h2>
      <p>
        For questions about how {siteConfig.title} handles your information, or to make a privacy
        request, email{' '}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Information we collect and how it is used</h2>
      <ul className="policy-list">
        <li><strong>Enquiries and contact details:</strong> your name, email address, telephone number and the information you include when contacting us, so we can respond to your enquiry.</li>
        <li><strong>Appointments and service information:</strong> booking details and information you choose to provide about your goals, preferences and circumstances, to arrange consultations and discuss suitable support.</li>
        <li><strong>Website use:</strong> visit and interaction information collected through Google Analytics to help understand website use and improve it. The cookie section below explains this separately.</li>
      </ul>
      <p>
        Information may also be used for service administration and record keeping. Where promotional
        communications are sent, you can ask us to stop by contacting the email address above.
        Please contact us if you want to understand the purpose or legal basis for a particular use
        of your information, or how long a particular record is kept.
      </p>

      <h2>Sharing and external services</h2>
      <p>
        We do not sell or lease your personal information without your permission. Information may be handled by service
        providers involved in website analytics or appointment scheduling, or disclosed where required
        by law. Google and Calendly have their own privacy policies, linked in the cookie section below.
      </p>
      <p>
        Social media and shop links lead to other organisations’ websites. Information you provide
        to those organisations is covered by their own policies. Review their policies before sharing
        personal information or making a purchase.
      </p>

      <h2>Website guide</h2>
      <p>
        The website guide answers from reviewed website information and provides navigation links.
        Recent chat messages are kept in this tab’s memory and can be removed with “Clear chat” or
        by reloading the page. The guide does not send messages to an external AI service or make
        bookings on your behalf. For personal advice or enquiries, contact Jaz directly.
      </p>

      <h2>Cookies and tracking</h2>
      <CookieDisclosure />

      <h2>Protecting your information</h2>
      <p>
        We aim to handle your information securely and prevent unauthorised access or disclosure.
        No website or method of sending information over the internet can guarantee complete security.
        Please avoid sending sensitive health information in a public social media comment.
      </p>

      <h2>Your privacy and GDPR rights</h2>
      <p>
        Your rights depend on the circumstances and the basis on which information is processed.
        Under UK data protection law, these can include:
      </p>
      <ul className="policy-list">
        <li><strong>Access and correction:</strong> ask for a copy of personal information held about you and ask for inaccurate or incomplete details to be corrected.</li>
        <li><strong>Deletion and restriction:</strong> ask for information to be deleted or its use restricted where the right applies.</li>
        <li><strong>Objection:</strong> object to certain uses of your information, including direct marketing.</li>
        <li><strong>Data portability:</strong> request a usable copy of information you provided where the right applies.</li>
        <li><strong>Withdrawal of consent:</strong> where processing relies on your consent, you can withdraw that consent.</li>
      </ul>
      <p>
        To make a request, email{' '}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        For an overview of these rights, see{' '}
        <a href="https://www.gov.uk/data-protection" target="_blank" rel="noopener noreferrer">UK government data protection guidance</a>.
      </p>

      <h2>Questions, complaints and policy updates</h2>
      <p>
        Please contact us first if you have a concern about how your information has been handled.
        You can also raise a concern with the{' '}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">Information Commissioner’s Office (ICO)</a>,
        the UK data protection regulator.
      </p>
      <p>
        This policy may be updated when the website or its services change. The date above identifies
        the latest version. The same combined policy is available through the footer and at{' '}
        <a href="/privacy">/privacy</a>.
      </p>
    </div>
  );
}
