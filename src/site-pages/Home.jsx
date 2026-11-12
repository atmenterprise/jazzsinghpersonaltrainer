import React from 'react';
import { featuredTestimonials as getFeaturedTestimonials } from '../utils/featuredTestimonials';
import { useSections } from '../hooks/useSections';
import siteConfig from '../data/siteConfig.json';
import { useProgrammes } from '../hooks/useProgrammes';
import { useTestimonials } from '../hooks/useTestimonials';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeSuccessStories from '../components/HomeSuccessStories';

export default function Home() {
  const { about, specialistAreas } = useSections();
  const programs = useProgrammes();
  const testimonials = useTestimonials();
  const featuredTestimonials = getFeaturedTestimonials(testimonials);

  const truncateWords = (str, numWords) => {
    if (!str) return '';
    const words = str.trim().split(/\s+/);
    if (words.length <= numWords) return str;
    return words.slice(0, numWords).join(' ') + '...';
  };

  return (
    <div id="page-top">
      <Nav />

      {/* Header */}
      <Header />

      {/* About Section */}
      <section className="bg-primary about-section" id="about" aria-labelledby="about-title">
        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
        <div className="container">
          <div className="about-layout">
            <div className="about-portrait">
              <img src={about.image_url.startsWith("/") || about.image_url.startsWith("https:") ? about.image_url : `/${about.image_url}`} loading="lazy" className="aboutmeprofile" alt={about.alt} />
            </div>
            <div className="about-copy fontblack">
              <h2 id="about-title" className="section-heading highlight">{about.title}</h2>
              <hr className="light" />
              <p className="lead">{about.introduction}</p>
              {about.description.split(/\n\s*\n/).map((paragraph, index) => <p className="lead" key={index}>{paragraph}</p>)}
              <a href="/booking#book" className="btn btn-default btn-lg page-scroll" rel="noopener noreferrer">
                {about.cta_text}
              </a>
            </div>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Services / Specialist Areas Section */}
      <section id="services" aria-labelledby="services-title">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 id="services-title" className="section-heading highlight">Specialist Areas</h2>
              <hr className="primary" />
              <p className="specialist-intro">Personalised support for the way you train, eat and feel. Find the focus that fits your goals.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="specialist-grid">
            {specialistAreas.map(area => <div className="specialist-item" key={area.id}>
              <div className="service-box">
                <img src={area.image_url.startsWith("/") || area.image_url.startsWith("https:") ? area.image_url : `/${area.image_url}`} className="iconstyle" alt="" />
                <h3 className="lead">{area.name}</h3>
                <p className="specialist-description">{area.description}</p>
              </div>
            </div>)}
          </div>
          <div className="specialist-cta">
            <a href="/booking#book" className="btn btn-primary btn-lg page-scroll">
              Reach your goal today &raquo;
            </a>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Programmes Section */}
      <section className="bg-dark" id="programmes">
        <div className="container bg-dark">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading highlight">Programmes</h2>
              <hr className="primary" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" id={program.program_id} key={program.id} aria-labelledby={`programme-title-${program.id}`}>
                <div className="program-visual">
                  <img src={`/${program.image_url}`} className="program-image" alt={program.name} loading="lazy" />
                </div>
                <div className="program-copy">
                  <h3 id={`programme-title-${program.id}`}>{program.name}</h3>
                  <p>{truncateWords(program.short_description, 40)}</p>
                  <a className="program-link" href={`/${program.page_url}`}>View details <span aria-hidden="true">&raquo;</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Success Stories Section */}
      <section className="home-success" id="success" aria-labelledby="success-title">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 id="success-title" className="section-heading highlight">Client Success Stories</h2>
              <hr className="success-divider" aria-hidden="true" />
              <p className="success-intro">Different starting points. Personal support. Progress in everyday life.</p>
            </div>
          </div>
        </div>

        <div className="container">
          <HomeSuccessStories entries={featuredTestimonials} />
          <div className="stories-cta">
            <h3>Your results begin with a complimentary consultation.</h3>
            <div className="stories-actions">
              <a href="/booking#book" className="btn btn-primary btn-lg">Book Your Complimentary Consultation</a>
              <a href="/testimonials" className="btn btn-default btn-md">Read more Client Success Stories &raquo;</a>
            </div>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Shop Section */}
      <section id="shop" aria-labelledby="shop-title">
        <div className="container">
          <div className="text-center">
            <h2 id="shop-title" className="section-heading highlight">Shop</h2>
            <hr className="primary" />
          </div>
          <div className="shop-feature">
            <div className="shop-brand-image">
              <img src="/img/shop/reflex.jpg" loading="lazy" alt="Reflex Nutrition" />
            </div>
            <div className="shop-offer">
              <span className="shop-offer-badge">22% off</span>
              <h3>Get 22% off Reflex Nutrition</h3>
              <p>At the forefront of Sports Nutrition for 25 years</p>
              <a href="https://bit.ly/3Ay9c7O" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">Shop Now <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="container">
          <div className="contact-intro">
            <div>
              <span className="section-eyebrow">Let’s get started</span>
              <h2 id="contact-title">Contact</h2>
              <p>Your results begin with a complimentary consultation.</p>
            </div>
            <a href="/booking#book" className="btn btn-primary btn-lg">Book your consultation <span aria-hidden="true">↗</span></a>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true"><i className="bi bi-chat-dots"></i></span>
              <h3>Let’s talk</h3>
              <div className="contact-method">
                <span>Telephone</span>
                <a href="tel:+447415547566">+44 (0) 7415 547566</a>
              </div>
              <div className="contact-method">
                <span>Email</span>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </div>
              <a className="contact-action" href={siteConfig.whatsapp_url} target="_blank" rel="noopener noreferrer">Message on WhatsApp <i className="bi bi-arrow-up-right" aria-hidden="true"></i></a>
            </div>
            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true"><i className="bi bi-geo-alt"></i></span>
              <h3>Find me in Ilford</h3>
              <address><strong>The Gym Group</strong><br />Pioneer Point, 3-5 Winston Way<br />Ilford, IG1 2ZG, Essex<br />United Kingdom</address>
              <a className="contact-action" href={siteConfig.address_url} target="_blank" rel="noopener noreferrer">Get directions <i className="bi bi-arrow-up-right" aria-hidden="true"></i></a>
            </div>
            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true"><i className="bi bi-people"></i></span>
              <h3>Stay connected</h3>
              <p>Follow me on social media</p>
              <a className="contact-network" href={siteConfig.instagram_url} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" aria-hidden="true"></i><span>@jaz_boom_pt</span><span aria-hidden="true">↗</span></a>
              <a className="contact-network" href={siteConfig.facebook_url} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook" aria-hidden="true"></i><span>{siteConfig.title}</span><span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
