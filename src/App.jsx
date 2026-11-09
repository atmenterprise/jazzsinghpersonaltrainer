import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './site-pages/Home';
import Booking from './site-pages/Booking';
import OneToOnePT from './site-pages/OneToOnePT';
import CouplePT from './site-pages/CouplePT';
import OnlinePT from './site-pages/OnlinePT';
import NutritionPT from './site-pages/NutritionPT';
import Disclaimer from './site-pages/Disclaimer';
import Privacy from './site-pages/Privacy';
import Testimonials from './site-pages/Testimonials';
import Faq from './site-pages/Faq';
import WebsiteGuide from './components/WebsiteGuide';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPath = useRef(null);

  useEffect(() => {
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    if (location.hash === '#faq' && ['/onetoonept', '/couplept', '/onlinept', '/nutritionpt'].includes(location.pathname)) {
      navigate('/faq', { replace: true });
      return;
    }
    // Arrive at the top from Home; keep the list position for same-page story links.
    if (location.pathname === '/testimonials' && /^#story-\d+$/.test(location.hash)) {
      if (changedPage) window.scrollTo(0, 0);
      return;
    }
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const offset = (document.getElementById('mainNav')?.offsetHeight || 72) + 16;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, navigate]);

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/onetoonept" element={<OneToOnePT />} />
      <Route path="/couplept" element={<CouplePT />} />
      <Route path="/onlinept" element={<OnlinePT />} />
      <Route path="/nutritionpt" element={<NutritionPT />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/faq" element={<Faq />} />
      {/* Fallback to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
    {!location.pathname.startsWith('/admin') && <WebsiteGuide />}
    </>
  );
}
