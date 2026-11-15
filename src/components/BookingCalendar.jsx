import React, { useEffect, useRef, useState } from 'react';
import siteConfig from '../data/siteConfig.json';
import { loadCalendly } from '../utils/loadCalendly';

export default function BookingCalendar() {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const host = hostRef.current;
    let timeout;
    const startSlowTimer = () => {
      if (timeout !== undefined) return;
      timeout = window.setTimeout(() => {
        if (active) setStatus((current) => current === 'loading' ? 'slow' : current);
      }, 18000);
    };
    // Calendly can defer its iframe until it approaches the viewport.
    const visibilityObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startSlowTimer();
        visibilityObserver.disconnect();
      }
    }, { rootMargin: '200px 0px' }) : null;
    if (visibilityObserver) visibilityObserver.observe(host);
    else startSlowTimer();
    const handleMessage = (event) => {
      if (event.origin !== 'https://calendly.com' || event.source !== host.querySelector('iframe')?.contentWindow) return;
      if (['calendly.event_type_viewed', 'calendly.profile_page_viewed'].includes(event.data?.event)) {
        if (active) setStatus('ready');
      }
    };
    window.addEventListener('message', handleMessage);
    const observer = new MutationObserver(() => {
      const frame = host.querySelector('iframe');
      if (frame) frame.title = 'Book your complimentary consultation with Jaz';
    });
    observer.observe(host, { childList: true });

    loadCalendly().then((calendly) => {
      if (!active) return;
      const url = new URL(siteConfig.calendy_url);
      url.searchParams.set('background_color', 'ffffff');
      url.searchParams.set('text_color', '202020');
      url.searchParams.set('primary_color', 'd6ad60');
      url.searchParams.set('hide_event_type_details', '1');
      calendly.initInlineWidget({ url: url.toString(), parentElement: host, resize: true });
    }).catch(() => {
      if (active) setStatus('error');
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
      visibilityObserver?.disconnect();
      host.replaceChildren();
    };
  }, []);

  return (
    <div className="booking-calendar" data-state={status}>
      {status !== 'ready' && <div className={`booking-calendar-status ${status === 'error' ? 'booking-calendar-error' : ''}`} role="status">
        {status === 'loading' && <span className="booking-loading-dot" aria-hidden="true"></span>}
        <p>{status === 'error' ? 'The calendar could not load here. You can still choose a time directly in Calendly.' : status === 'slow' ? 'The calendar is taking a little longer to load. You can also open it directly.' : 'Loading available consultation times…'}</p>
        {status !== 'loading' && <a className="btn btn-default" href={siteConfig.calendy_url} target="_blank" rel="noopener noreferrer">Open Calendly <span aria-hidden="true">↗</span></a>}
      </div>}
      <div ref={hostRef} className="booking-embed calendly-inline-widget" data-auto-load="false" aria-busy={status === 'loading'}></div>
      <div className="booking-calendar-alternative"><span>Prefer to book in a separate window?</span><a href={siteConfig.calendy_url} target="_blank" rel="noopener noreferrer">Open Calendly <span aria-hidden="true">↗</span></a></div>
    </div>
  );
}
