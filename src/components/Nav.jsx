import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../data/siteConfig.json';
import programs from '../data/programs.json';

const sections = [
  ['Home', 'page-top'],
  ['About Me', 'about'],
  ['Specialist Areas', 'services'],
  ['Programmes', 'programmes'],
  ['Shop', 'shop'],
  ['Success Stories', 'success'],
  ['Book Now', 'booking'],
  ['Contact', 'contact'],
];

export default function Nav() {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAffixed, setIsAffixed] = useState(false);
  const [activeSection, setActiveSection] = useState('page-top');
  const navRef = useRef(null);
  const programmesRef = useRef(null);
  const dropdownToggleRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const closeMenus = () => {
    setNavCollapsed(true);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const updateScroll = () => {
      setIsAffixed(window.scrollY > 100);
      if (!isHome) return;
      const offset = (navRef.current?.offsetHeight || 72) + 20;
      let current = 'page-top';
      for (const [, id] of sections) {
        if (id === 'booking') continue;
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) current = id;
      }
      setActiveSection(current);
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, [isHome]);

  useEffect(() => {
    setNavCollapsed(true);
    setDropdownOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const dismiss = (event) => {
      if (!programmesRef.current?.contains(event.target)) setDropdownOpen(false);
      if (event.type === 'pointerdown' && !navRef.current?.contains(event.target)) setNavCollapsed(true);
    };
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      if (dropdownOpen) {
        setDropdownOpen(false);
        dropdownToggleRef.current?.focus();
      } else if (!navCollapsed) {
        setNavCollapsed(true);
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('focusin', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('focusin', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [dropdownOpen, navCollapsed]);

  const sectionLink = (id, className = 'page-scroll') => {
    const destination = id === 'booking' ? '/booking#book'
      : id === 'success' && !isHome ? '/testimonials'
      : id === 'page-top' ? '/' : `/#${id}`;
    return {
      className,
      to: destination,
      onClick: (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        closeMenus();
        if (!isHome || id === 'booking') return;
        const element = document.getElementById(id);
        if (!element) return;
        event.preventDefault();
        const top = id === 'page-top' ? 0 : element.getBoundingClientRect().top + window.scrollY - 88;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
        setActiveSection(id);
      },
    };
  };

  const isActive = (id) => isHome ? activeSection === id
    : id === 'booking' ? location.pathname === '/booking'
    : id === 'success' ? location.pathname === '/testimonials'
    : id === 'programmes' && programs.some((program) => location.pathname === `/${program.page_url}`);

  return (
    <nav ref={navRef} id="mainNav" aria-label="Main navigation" className={`navbar navbar-default navbar-fixed-top ${isAffixed ? 'affix' : 'affix-top'}`}>
      <div className="container-fluid">
        <div className="navbar-header">
          <button ref={mobileToggleRef} type="button" className={`navbar-toggle ${navCollapsed ? 'collapsed' : ''}`} aria-expanded={!navCollapsed} aria-controls="main-navigation-links" onClick={() => {
            setNavCollapsed(!navCollapsed);
            setDropdownOpen(false);
          }}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
          </button>
          <Link {...sectionLink('page-top', 'navbar-brand page-scroll')}>{siteConfig.title}</Link>
        </div>
        <div className={`collapse navbar-collapse ${navCollapsed ? '' : 'in'}`} id="main-navigation-links">
          <ul className="nav navbar-nav navbar-right">
            {sections.map(([label, id]) => (
              <li key={id} ref={id === 'programmes' ? programmesRef : undefined} className={`${isActive(id) ? 'active' : ''} ${id === 'programmes' ? 'programmes-nav' : ''}`}>
                {id === 'programmes' ? (
                  <>
                    <div className="programmes-control">
                      <Link {...sectionLink(id)} aria-current={isActive(id) ? 'location' : undefined}>{label}</Link>
                      <button ref={dropdownToggleRef} type="button" className="programmes-toggle" aria-label="Choose a programme" aria-expanded={dropdownOpen} aria-controls="programme-navigation" onClick={() => setDropdownOpen(!dropdownOpen)} onKeyDown={(event) => {
                        if (event.key !== 'ArrowDown') return;
                        event.preventDefault();
                        setDropdownOpen(true);
                        requestAnimationFrame(() => programmesRef.current?.querySelector('.programme-menu a')?.focus());
                      }}><i className="bi bi-chevron-down" aria-hidden="true"></i></button>
                    </div>
                    {dropdownOpen && <ul className="programme-menu" id="programme-navigation" aria-label="Programmes">
                      {programs.map((program) => <li key={program.id}>
                        <Link to={`/${program.page_url}`} onClick={closeMenus} aria-current={location.pathname === `/${program.page_url}` ? 'page' : undefined}>{program.name}</Link>
                      </li>)}
                    </ul>}
                  </>
                ) : <Link {...sectionLink(id, id === 'booking' ? 'page-scroll nav-booking' : 'page-scroll')} aria-current={isActive(id) ? 'location' : undefined}>{label}</Link>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
