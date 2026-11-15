import { useEffect, useState } from 'react';
import initialTestimonials from '../data/testimonials.json';

// Keep the static export available; Next deployments refresh from the admin database.
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('/api/testimonials', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Testimonials unavailable');
        const records = await response.json();
        if (!Array.isArray(records)) throw new Error('Invalid testimonials response');
        setTestimonials(records);
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Unable to refresh testimonials; showing the last available stories.');
      }
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.removeEventListener('focus', refresh); };
  }, []);
  return testimonials;
}
