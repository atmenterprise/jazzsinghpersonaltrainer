import React from 'react';

export default function CookieDisclosure() {
  return (
    <div className="cookie-disclosure">
      <p>
        Cookies are small files stored by your browser. This website includes Google Analytics 4
        to measure website use and Calendly to provide appointment scheduling. These services may
        use cookies or similar technologies, subject to your browser settings and the providers’ settings.
      </p>
      <h3>Website analytics</h3>
      <p>
        Google Analytics is initialised when this website loads. It helps measure visits and interactions.
        Its standard cookies include <code>_ga</code> to distinguish visitors and <code>_ga_*</code> to
        maintain session information. Google lists a default lifetime of two years for these cookies;
        actual lifetimes can differ because of browser limits and service settings.
      </p>
      <p>
        Learn more in{' '}
        <a href="https://support.google.com/analytics/answer/11397207?hl=en" target="_blank" rel="noopener noreferrer">Google’s explanation of Analytics cookies</a>{' '}
        and{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.
      </p>
      <h3>Appointment scheduling</h3>
      <p>
        Calendly provides the scheduling widget and booking links. When its services are loaded or opened,
        Calendly may use cookies for scheduling, security and preferences. Any choices shown within Calendly
        apply to that service and do not control this website’s Google Analytics setup.
        See{' '}
        <a href="https://calendly.com/help/cookies-and-your-calendly-experience" target="_blank" rel="noopener noreferrer">Calendly’s cookie information</a>{' '}
        and{' '}
        <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly’s privacy policy</a>.
      </p>
      <h3>Browser controls and external services</h3>
      <p>
        This website does not provide an on-site cookie preference panel. You can block or delete cookies
        through your browser settings, although blocking cookies alone does not necessarily prevent all
        analytics requests. Blocking third-party services may affect appointment scheduling.
      </p>
      <p>
        Fonts and icon styles are loaded from Google Fonts and jsDelivr. Social media and shop links lead
        to external websites with their own privacy and cookie policies. This notice describes the services
        included in this website; it does not record consent or change your browser settings.
      </p>
    </div>
  );
}
