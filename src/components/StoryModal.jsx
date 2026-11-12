import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { storyText } from '../utils/testimonialBrowser';

export default function StoryModal({ entry, onClose }) {
  const dialogRef = useRef(null);
  const { title, author, description, link } = entry.testimonial;

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected && trigger !== document.body) trigger.focus({ preventScroll: true });
      else document.getElementById('stories-results-title')?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog className="policy-modal story-modal" ref={dialogRef} aria-labelledby="full-story-title" onCancel={onClose} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <div className="policy-modal-header">
        <div><span className="full-story-eyebrow">Client Success Story</span><h2 id="full-story-title">{storyText(title)}</h2></div>
        <button type="button" className="policy-close" aria-label="Close full story" autoFocus onClick={onClose}>×</button>
      </div>
      <div className="policy-modal-body">
        <p className="full-story-author">Testimonial by <strong>{author}</strong></p>
        <div className="full-story-text">{storyText(description).split(/\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {link && <a className="full-story-source" href={link} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" aria-hidden="true"></i> View the original story <span aria-hidden="true">↗</span></a>}
      </div>
      <div className="policy-modal-footer story-modal-footer">
        <button type="button" className="btn btn-default" onClick={onClose}>Back to stories</button>
        <a className="btn btn-primary" href="/booking#book">Book Your Complimentary Consultation</a>
      </div>
    </dialog>, document.body
  );
}
