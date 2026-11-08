import React from 'react';
import highlights from '../data/storyHighlights.json';

export default function HomeSuccessStories({ entries }) {
  return (
    <div className="home-story-grid">
      {entries.map((entry, index) => {
        const highlight = highlights[entry.id];
        if (!highlight) return null;
        const { author } = entry.testimonial;
        return (
          <article key={entry.id} className={index === 0 ? 'home-story home-story-featured' : 'home-story'} aria-labelledby={`home-story-title-${entry.id}`}>
            <div className="home-story-body">
              <span className="home-story-focus">{highlight.focus}</span>
              <h3 id={`home-story-title-${entry.id}`}>{highlight.headline}</h3>
              {highlight.journey ? <ol className="story-journey">
                {highlight.journey.map((step) => <li key={step.label}><strong>{step.label}</strong><p>{step.text}</p></li>)}
              </ol> : <p className="home-story-summary">{highlight.summary}</p>}
            </div>
            <div className="home-story-excerpt">
              <span className="home-story-excerpt-label">From {author}’s story</span>
              <blockquote>{highlight.excerpt}</blockquote>
              <div className="home-story-person">
                <span className="story-avatar" aria-hidden="true">{author.split(/\s+/).slice(0, 2).map((name) => name[0]).join('')}</span>
                <strong>{author}</strong>
              </div>
              <a href={`/testimonials#story-${entry.id}`} className="home-story-link">Read the full story <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
