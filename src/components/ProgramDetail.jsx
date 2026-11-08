import React from 'react';
import ProgramLayout from './ProgramLayout';
import ProgramSocial from './ProgramSocial';
import siteConfig from '../data/siteConfig.json';
import programs from '../data/programs.json';

export default function ProgramDetail({ title, introduction, sections }) {
  return (
    <ProgramLayout>
      <main className="programme-page">
        <header className="detail-hero" aria-labelledby="programme-title">
          <div className="container detail-hero-inner">
            <div>
              <a className="detail-back" href="/#programmes"><span aria-hidden="true">←</span> All programmes</a>
              <h1 id="programme-title">{title}</h1>
              <div className="detail-introduction">{introduction}</div>
              <div className="detail-hero-actions">
                <a className="btn btn-primary btn-lg" href="/booking#book">Book Your Complimentary Consultation</a>
                <a className="btn btn-default" href="/faq">Frequently Asked Questions</a>
              </div>
            </div>
            <img className="detail-logo" src={`/${siteConfig.logo}`} alt="Jaz BooM Personal Training" width="200" height="200" />
          </div>
        </header>
        <div className="container detail-layout">
          <div className="detail-sections">
            {sections.map((section) => <section className="detail-section" key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.content}
            </section>)}
          </div>
          <aside className="detail-sidebar" aria-label="Programme information and booking">
            <nav className="detail-contents" aria-label="On this page">
              <h2>In this programme</h2>
              {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}<span aria-hidden="true">↗</span></a>)}
            </nav>
            <ProgramSocial />
            <div className="detail-faq-card">
              <i className="bi bi-chat-square-text" aria-hidden="true"></i>
              <h2>Have a question?</h2>
              <p>Find out more about training, nutrition and getting started.</p>
              <a href="/faq" className="btn btn-default">Frequently Asked Questions <span aria-hidden="true">↗</span></a>
            </div>
          </aside>
        </div>
        <nav className="container detail-other-programmes" aria-label="Explore other programmes">
          <h2>Explore the programmes</h2>
          <div>{programs.map((program) => <a href={`/${program.page_url}`} key={program.id} aria-current={program.name === title || (program.id === 1 && title === 'One to One Personal Training') ? 'page' : undefined}>{program.name}<span aria-hidden="true">↗</span></a>)}</div>
        </nav>
      </main>
    </ProgramLayout>
  );
}
