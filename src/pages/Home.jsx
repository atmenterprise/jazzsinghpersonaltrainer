import React from 'react';
import siteConfig from '../data/siteConfig.json';
import programs from '../data/programs.json';
import testimonials from '../data/testimonials.json';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
      <section className="bg-primary" id="about">
        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h2 className="section-heading text-center highlight">About Me</h2>
              <hr className="light" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row flex-lg-row-reverse g-5 py-5">
            <div className="col-5 col-lg-5">
              <div className="row text-center">
                <img src="/img/profile/profile.jpg" loading="lazy" className="aboutmeprofile" alt="profile picture" />
              </div>
            </div>

            <div className="col-lg-7 text-center fontblack">
              <h4 className="lead text-justify">
                Hi, I’m <span className="highlight">Jaz</span>, a Nutritionist and Personal Trainer (PT) who has been helping people
                transform their health and fitness since 2012.
              </h4>
              <h4 className="lead text-justify">
                In 2004, I was diagnosed with a rare autoimmune condition that left me wheelchair-
                bound, requiring multiple surgeries and facing the possibility of never having
                children. I took my health into my own hands and refused to accept that outcome.
                Today, I am a father of three, walking, training, and living proof that the body is
                capable of more than a diagnosis suggests.
              </h4>
              <h4 className="lead text-justify">
                I continue to manage this condition and epilepsy through exercise, nutrition, and
                deliberate daily lifestyle choices. That experience is not merely my backstory; it is the
                foundation of my work and the reason I understand the challenges of maintaining
                fitness and nutrition when facing health obstacles.
              </h4>
              <h4 className="lead text-justify">
                Over that time, I have specialised in sustainable fat loss and helping individuals
                manage chronic conditions such as high blood pressure, cholesterol, and blood
                sugar, so they can regain control of their health through targeted training and
                nutrition.
              </h4>
              <h4 className="lead text-justify">
                Many clients come to me after their GP has warned that their health markers are
                trending in the wrong direction. If you have previously struggled to maintain a gym
                routine or experienced weight regain, I will create a bespoke plan tailored to your
                lifestyle, health history, and goals.
              </h4>
              <h4 className="lead text-justify">
                As a former Expert Patient Programme Tutor, I have extensive experience teaching
                individuals with long-term conditions to manage symptoms through lifestyle changes,
                bridging the gap between medical needs and fitness.
              </h4>
              <h4 className="lead text-justify">
                Every client I have worked with has successfully lost weight, improved health
                markers, built strength, or achieved all three. Yours could be the next success story.
              </h4>
              <h4 className="lead text-justify">
                Your results begin with a complimentary consultation.
              </h4>
              <a href="/booking#book" className="btn btn-default btn-lg page-scroll" rel="noopener noreferrer">
                Book yours today and let’s get started.
              </a>
            </div>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Services / Specialist Areas Section */}
      <section id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading highlight">Specialist Areas</h2>
              <hr className="primary" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-4 col-md-6 text-center">
              <div className="service-box">
                <img src="/img/icons/treadmill.gif" className="iconstyle" alt="Sustainable Weight Loss" />
                <h3 className="lead">Sustainable Weight Loss</h3>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 text-center">
              <div className="service-box">
                <img src="/img/icons/deadlift.gif" className="iconstyle" alt="Strength Training & Body Toning" />
                <h3 className="lead">Strength Training & Body Toning</h3>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 text-center">
              <div className="service-box">
                <img src="/img/icons/balance.gif" className="iconstyle" alt="Lowering Blood Sugar, Cholesterol & Blood Pressure" />
                <h3 className="lead">Lowering Blood Sugar, Cholesterol & Blood Pressure</h3>
              </div>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-lg-4 col-md-6 text-center">
              <div className="service-box">
                <img src="/img/icons/muscle.gif" className="iconstyle" alt="Advanced Nutrition & Sports Nutrition" />
                <h3 className="lead">Advanced Nutrition & Sports Nutrition</h3>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 text-center">
              <div className="service-box">
                <img src="/img/icons/exercise-routine.gif" className="iconstyle" alt="Personalised Nutrition Plans & Training Programmes" />
                <h3 className="lead">Personalised Nutrition Plans & Training Programmes</h3>
              </div>
            </div>
          </div>
          <hr />
          <div className="row text-center">
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
        <p></p>
        <p></p>
        <div className="container bg-dark">
          <div className="row text-justify">
            {programs.map((program) => (
              <div className="col-md-6" id={program.program_id} key={program.id}>
                <div className="col-md-12 panel bg-dark">
                  <div className="thumbnail bg-dark">
                    <div className="panel-body text-center">
                      <img src={`/${program.image_url}`} className="cropped-image" alt={program.name} />
                    </div>
                    <h3 className="panel-header highlight text-center">{program.name}</h3>
                    <hr />
                    <div className="panel-body">
                      <p className="wrap text-center">{truncateWords(program.short_description, 40)}</p>
                      <p className="text-center">
                        <a className="btn btn-default" href={`/${program.page_url}`} role="button">
                          View details &raquo;
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Shop Section */}
      <section className="" id="shop">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading highlight">Shop</h2>
              <hr className="" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row text-center">
            <div className="col-sm-6 col-md-4">
              <div className="thumbnail">
                <p></p>
                <a href="https://bit.ly/3Ay9c7O" target="_blank" rel="noopener noreferrer">
                  <img src="/img/shop/reflex.jpg" style={{ width: '40%', height: '40%' }} alt="reflex nutrition off" />
                </a>
                <div className="caption">
                  <a href="https://bit.ly/3Ay9c7O" target="_blank" rel="noopener noreferrer">
                    <h3 className="highlight">
                      Get <span style={{ color: 'red' }}>22% off</span> Reflex Nutrition
                    </h3>
                  </a>
                  <p>At the forefront of Sports Nutrition for 25 years</p>
                  <a href="https://bit.ly/3Ay9c7O" className="btn btn-primary btn-md page-scroll lead" target="_blank" rel="noopener noreferrer">
                    Shop Now &raquo;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Success Stories Section */}
      <section className="bg-primary" id="success">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading highlight">The Result you can expect</h2>
              <hr className="light" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {featuredTestimonials.map((t) => (
              <div className="col-md-6 bg-primary" key={t.id}>
                <div className="col-md-12 bg-primary">
                  <div className="thumbnail">
                    <h4 className="panel-header highlight text-center fontblack">{t.testimonial.title}</h4>
                    <hr />
                    <p className="fontblack text-center">
                      Testimonial By:&nbsp;&nbsp;<span className="highlight">{t.testimonial.author}</span>
                      <span className="text-muted">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                      <a
                        href={t.testimonial.link || siteConfig.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-instagram fa-x"></i>
                      </a>
                    </p>
                    <div className="panel-body text-justify">
                      <p className="fontblack">
                        <i className="bi bi-quote fa-lg fontblack"></i>
                        <span className="wrap">{truncateWords(t.testimonial.description, 90)}</span>{' '}
                        <a href="/testimonials" target="_parent" rel="noopener noreferrer">
                          read more
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row text-center">
            <a href="/testimonials" className="btn btn-default btn-md">
              Read more Client Success Stories &raquo;
            </a>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading highlight">Contact</h2>
              <hr className="primary" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2 className="lead highlight text-center">Follow me on social media</h2>
              <div className="row text-center">
                <div className="row-sm-2">
                  <a href={siteConfig.facebook_url} className="btn" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook socialicon-sm"></i>
                    {siteConfig.title}
                  </a>
                </div>
                <div className="row-sm-2">
                  <a href={siteConfig.instagram_url} className="btn" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-instagram socialicon-sm"></i>
                    @jaz_boom_pt
                  </a>
                </div>
                <div className="row-sm-2">
                  <a href={siteConfig.whatsapp_url} className="btn" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-whatsapp socialicon-sm"></i>
                    Whatsapp
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h2 className="lead highlight text-center">Address</h2>
              <p className="text-center">
                The Gym Group<br />
                Pioneer Point, <br />
                3-5 Winston Way, <br />
                Ilford, IG1 2ZG, <br />
                Essex, <br />
                United Kingdom
              </p>
            </div>
            <div className="col-md-4">
              <div className="row">
                <h2 className="lead highlight text-center">Telephone</h2>
                <p className="text-center">+44 (0) 7415 547566</p>
              </div>
              <div className="row">
                <h2 className="lead highlight text-center">Email</h2>
                <p className="text-center">
                  <a href={`mailTo:${siteConfig.email}`}>{siteConfig.email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <img src={`/${siteConfig.logo}`} className="logowatermark" alt="jaz boom logo" />
      </section>

      <Footer />
    </div>
  );
}
