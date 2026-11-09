import React from 'react';
import siteConfig from '../data/siteConfig.json';
import programs from '../data/programs.json';
import testimonials from '../data/testimonials.json';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeSuccessStories from '../components/HomeSuccessStories';

export default function Home() {
  const featuredTestimonials = testimonials.filter((t) => t.featured === true);

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
              <img src="/img/profile/profile.jpg" loading="lazy" className="aboutmeprofile" alt="Jaz, personal trainer and nutritionist" />
            </div>
            <div className="about-copy fontblack">
              <h2 id="about-title" className="section-heading highlight">About Me</h2>
              <hr className="light" />
              <p className="lead">
                Hi, I’m <span className="highlight">Jaz</span>, a Nutritionist and Personal Trainer (PT) who has been helping people
                transform their health and fitness since 2012.
              </p>
              <p className="lead">
                In 2004, I was diagnosed with a rare autoimmune condition that left me wheelchair-
                bound, requiring multiple surgeries and facing the possibility of never having
                children. I took my health into my own hands and refused to accept that outcome.
                Today, I am a father of three, walking, training, and living proof that the body is
                capable of more than a diagnosis suggests.
              </p>
              <p className="lead">
                I continue to manage this condition and epilepsy through exercise, nutrition, and
                deliberate daily lifestyle choices. That experience is not merely my backstory; it is the
                foundation of my work and the reason I understand the challenges of maintaining
                fitness and nutrition when facing health obstacles.
              </p>
              <p className="lead">
                Over that time, I have specialised in sustainable fat loss and helping individuals
                manage chronic conditions such as high blood pressure, cholesterol, and blood
                sugar, so they can regain control of their health through targeted training and
                nutrition.
              </p>
              <p className="lead">
                Many clients come to me after their GP has warned that their health markers are
                trending in the wrong direction. If you have previously struggled to maintain a gym
                routine or experienced weight regain, I will create a bespoke plan tailored to your
                lifestyle, health history, and goals.
              </p>
              <p className="lead">
                As a former Expert Patient Programme Tutor, I have extensive experience teaching
                individuals with long-term conditions to manage symptoms through lifestyle changes,
                bridging the gap between medical needs and fitness.
              </p>
              <p className="lead">
                Every client I have worked with has successfully lost weight, improved health
                markers, built strength, or achieved all three. Yours could be the next success story.
              </p>
              <p className="lead">
                Your results begin with a complimentary consultation.
              </p>
              <a href="/booking#book" className="btn btn-default btn-lg page-scroll" rel="noopener noreferrer">
                Book yours today and let’s get started.
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
            <div className="specialist-item">
              <div className="service-box">
                <img src="/img/icons/treadmill.gif" className="iconstyle" alt="" />
                <h3 className="lead">Sustainable Weight Loss</h3>
                <p className="specialist-description">Build realistic eating and activity habits that fit your lifestyle, with a focus on steady progress and lasting change.</p>
              </div>
            </div>
            <div className="specialist-item">
              <div className="service-box">
                <img src="/img/icons/deadlift.gif" className="iconstyle" alt="" />
                <h3 className="lead">Strength Training & Body Toning</h3>
                <p className="specialist-description">Develop strength, improve your technique and grow in confidence with resistance training tailored to your starting point.</p>
              </div>
            </div>
            <div className="specialist-item">
              <div className="service-box">
                <img src="/img/icons/balance.gif" className="iconstyle" alt="" />
                <h3 className="lead">Lowering Blood Sugar, Cholesterol & Blood Pressure</h3>
                <p className="specialist-description">Build consistent exercise and nutrition habits to support your long-term health and wellbeing.</p>
              </div>
            </div>

            <div className="specialist-item">
              <div className="service-box">
                <img src="/img/icons/muscle.gif" className="iconstyle" alt="" />
                <h3 className="lead">Advanced Nutrition & Sports Nutrition</h3>
                <p className="specialist-description">Understand how to fuel your training, support recovery and make informed food choices around your activity and goals.</p>
              </div>
            </div>
            <div className="specialist-item">
              <div className="service-box">
                <img src="/img/icons/exercise-routine.gif" className="iconstyle" alt="" />
                <h3 className="lead">Personalised Nutrition Plans & Training Programmes</h3>
                <p className="specialist-description">Bring your exercise and nutrition together in a structured plan shaped around your routine, preferences and goals.</p>
              </div>
            </div>
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
