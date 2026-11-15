import { useEffect, useState } from 'react';
import initialPages from '../data/programmePages.json';

// Keep the static export available; Next deployments refresh from the admin database.
export function useProgrammePages() {
  const [programs, setProgrammes] = useState(initialPages);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('/api/programme-pages', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Programmes unavailable');
        const records = await response.json();
        if (!Array.isArray(records)) throw new Error('Invalid programmes response');
        setProgrammes(records);
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Unable to refresh programmes; showing the last available content.');
      }
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.removeEventListener('focus', refresh); };
  }, []);
  return programs;
}
