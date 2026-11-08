import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import OneToOnePT from './pages/OneToOnePT';
import CouplePT from './pages/CouplePT';
import OnlinePT from './pages/OnlinePT';
import NutritionPT from './pages/NutritionPT';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import Testimonials from './pages/Testimonials';

export default function App() {
  const location = useLocation();

  useEffect(() => {
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
  }, [location.pathname, location.hash]);

  return (
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
      {/* Fallback to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
