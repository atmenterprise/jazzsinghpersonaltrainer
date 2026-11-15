import { useEffect, useState } from 'react';
import initialAbout from '../data/about.json';
import initialAreas from '../data/specialistAreas.json';

export function useSections() {
  const [sections, setSections] = useState({ about: initialAbout, specialistAreas: initialAreas });
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('/api/sections', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Sections unavailable');
        const data = await response.json();
        if (!Array.isArray(data.specialistAreas)) throw new Error('Invalid sections response');
        setSections({ about: data.about || initialAbout, specialistAreas: data.specialistAreas });
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Unable to refresh website sections; showing the last available content.');
      }
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.removeEventListener('focus', refresh); };
  }, []);
  return sections;
}
