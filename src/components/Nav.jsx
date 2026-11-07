import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../data/siteConfig.json';
import programs from '../data/programs.json';

export default function Nav() {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAffixed, setIsAffixed] = useState(false);
  const [activeSection, setActiveSection] = useState('page-top');
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  // Handle affix on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsAffixed(true);
      } else {
        setIsAffixed(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy logic for home page
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = [
      'page-top',
      'about',
      'services',
      'programmes',
      'shop',
      'success',
      'contact'
    ];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120; // 120px offset for top navbar

      let current = 'page-top';
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // initial check

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [isHome]);

  // Close menus on route change
  useEffect(() => {
    setNavCollapsed(true);
    setDropdownOpen(false);
  }, [location]);

  const toggleNav = () => setNavCollapsed(!navCollapsed);
  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const handleNavClick = (targetId) => {
    setNavCollapsed(true);
    setDropdownOpen(false);
    if (isHome && targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const top = targetId === 'page-top' ? 0 : element.getBoundingClientRect().top + window.pageYOffset - 50;
        window.scrollTo({ top, behavior: 'smooth' });
        setActiveSection(targetId);
      }
    }
  };

  // Determine active state for other pages
  const isCurrentPath = (path) => location.pathname === path;
  const isProgramActive = programs.some((p) => location.pathname === `/${p.program_id}`);

  return (
    <nav
      id="mainNav"
      className={`navbar navbar-default navbar-fixed-top ${isAffixed ? 'affix' : 'affix-top'}`}
    >
      <div className="container-fluid">
        {/* Brand and toggle get grouped for better mobile display */}
        <div className="navbar-header">
          <button
            type="button"
            className={`navbar-toggle ${navCollapsed ? 'collapsed' : ''}`}
            onClick={toggleNav}
            aria-expanded={!navCollapsed}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>

          {isHome ? (
            <a
              className="navbar-brand page-scroll"
              href="#page-top"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('page-top');
              }}
            >
              {siteConfig.title}
            </a>
          ) : (
            <Link className="navbar-brand page-scroll" to="/">
              {siteConfig.title}
            </Link>
          )}
        </div>

        {/* Collect the nav links, forms, and other content for toggling */}
        <div
          className={`collapse navbar-collapse ${navCollapsed ? '' : 'in'}`}
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            {isHome ? (
              <>
                <li className={activeSection === 'page-top' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#page-top"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-top');
                    }}
                  >
                    Home
                  </a>
                </li>
                <li className={activeSection === 'about' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('about');
                    }}
                  >
                    About Me
                  </a>
                </li>
                <li className={activeSection === 'services' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('services');
                    }}
                  >
                    Specialist Areas
                  </a>
                </li>
                <li className={`dropdown ${dropdownOpen ? 'open' : ''} ${activeSection === 'programmes' ? 'active' : ''}`}>
                  <a
                    href="#"
                    className="dropdown-toggle page-scroll"
                    onClick={toggleDropdown}
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    Programmes <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu">
                    {programs.map((program) => (
                      <li key={program.id}>
                        <a
                          href={`#${program.program_id}`}
                          className="page-scroll"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(program.program_id);
                          }}
                        >
                          {program.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className={activeSection === 'shop' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#shop"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('shop');
                    }}
                  >
                    Shop
                  </a>
                </li>
                <li className={activeSection === 'success' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#success"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('success');
                    }}
                  >
                    Success Stories
                  </a>
                </li>
                <li className={location.pathname === '/booking' ? 'active' : ''}>
                  <Link
                    className="page-scroll"
                    to="/booking#book"
                    onClick={() => setNavCollapsed(true)}
                  >
                    Book Now
                  </Link>
                </li>
                <li className={activeSection === 'contact' ? 'active' : ''}>
                  <a
                    className="page-scroll"
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('contact');
                    }}
                  >
                    Contact
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className={isHome ? 'active' : ''}>
                  <Link className="page-scroll" to="/" onClick={() => setNavCollapsed(true)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="page-scroll" to="/#about" onClick={() => setNavCollapsed(true)}>
                    About Me
                  </Link>
                </li>
                <li>
                  <Link className="page-scroll" to="/#services" onClick={() => setNavCollapsed(true)}>
                    Specialist Areas
                  </Link>
                </li>
                <li className={`dropdown ${dropdownOpen ? 'open' : ''} ${isProgramActive ? 'active' : ''}`}>
                  <a
                    href="#"
                    className="dropdown-toggle page-scroll"
                    onClick={toggleDropdown}
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    Programmes <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu">
                    {programs.map((program) => (
                      <li key={program.id} className={isCurrentPath(`/${program.program_id}`) ? 'active' : ''}>
                        <Link
                          to={`/${program.program_id}`}
                          className="page-scroll"
                          onClick={() => {
                            setNavCollapsed(true);
                            setDropdownOpen(false);
                          }}
                        >
                          {program.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <Link className="page-scroll" to="/#shop" onClick={() => setNavCollapsed(true)}>
                    Shop
                  </Link>
                </li>
                <li className={isCurrentPath('/testimonials') ? 'active' : ''}>
                  <Link className="page-scroll" to="/testimonials" onClick={() => setNavCollapsed(true)}>
                    Success Stories
                  </Link>
                </li>
                <li className={isCurrentPath('/booking') ? 'active' : ''}>
                  <Link className="page-scroll" to="/booking#book" onClick={() => setNavCollapsed(true)}>
                    Book Now
                  </Link>
                </li>
                <li>
                  <Link className="page-scroll" to="/#contact" onClick={() => setNavCollapsed(true)}>
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
