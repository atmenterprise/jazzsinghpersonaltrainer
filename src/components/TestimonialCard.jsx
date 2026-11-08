import React, { useState } from 'react';
import siteConfig from '../data/siteConfig.json';

export default function TestimonialCard({ entry, preview = false }) {
  const [expanded, setExpanded] = useState(false);
  const { title, author, description, link } = entry.testimonial;
  const words = description.trim().split(/\s+/);
  const isLong = words.length > 70;
  const initials = author.split(/\s+/).slice(0, 2).map((name) => name[0]).join('');

  return (
    <article className="story-card" id={`story-${entry.id}`} aria-labelledby={`story-title-${entry.id}`}>
      <span className="story-quote" aria-hidden="true">“</span>
      <h3 id={`story-title-${entry.id}`} className="story-title">{title}</h3>
      <div className="story-copy" id={`story-copy-${entry.id}`}>
        {(expanded || !isLong ? description.trim() : `${words.slice(0, 70).join(' ')}…`)
          .split(/\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {preview ? (
        <a className="story-read" href={`/testimonials#story-${entry.id}`}>Read {author}’s story <span aria-hidden="true">↗</span></a>
      ) : isLong && (
        <button className="story-read" type="button" aria-expanded={expanded} aria-controls={`story-copy-${entry.id}`} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Read the full story'} <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      )}
      <div className="story-author">
        <span className="story-avatar" aria-hidden="true">{initials}</span>
        <div><span className="story-author-label">Testimonial By</span><strong>{author}</strong></div>
        <a className="story-social" href={link || siteConfig.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={link ? `View ${author}’s story on Instagram` : 'Visit Jaz BooM on Instagram'}>
          <i className="bi bi-instagram" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  );
}
