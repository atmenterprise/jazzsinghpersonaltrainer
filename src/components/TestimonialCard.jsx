import React from 'react';
import highlights from '../data/storyHighlights.json';
import { storyText } from '../utils/testimonialBrowser';

export default function TestimonialCard({ entry, onRead }) {
  const { title, author, description } = entry.testimonial;
  const highlight = { ...highlights[entry.id], ...entry.testimonial };
  const words = storyText(description).split(/\s+/);
  const excerpt = highlight?.excerpt || `${words.slice(0, 42).join(' ')}${words.length > 42 ? '…' : ''}`;
  const initials = author.split(/\s+/).slice(0, 2).map((name) => name[0]).join('');
  return (
    <article className="story-card browse-story-card" id={`story-${entry.id}`} aria-labelledby={`story-title-${entry.id}`}>
      <div className="browse-story-author"><span className="story-avatar" aria-hidden="true">{initials}</span><div><span>Client story</span><strong>{author}</strong></div>{entry.featured && <span className="story-featured-label">Featured</span>}</div>
      <h3 id={`story-title-${entry.id}`} className="story-title">{storyText(title)}</h3>
      <p className="browse-story-excerpt">{excerpt}</p>
      <button type="button" className="story-read" aria-haspopup="dialog" aria-label={`Read the full story by ${author}`} onClick={() => onRead(entry)}>Read the full story <span aria-hidden="true">↗</span></button>
    </article>
  );
}
