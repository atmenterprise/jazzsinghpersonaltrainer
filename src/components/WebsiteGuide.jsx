import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import siteConfig from '../data/siteConfig.json';
import { useProgrammes } from '../hooks/useProgrammes';
import { useTestimonials } from '../hooks/useTestimonials';
import highlights from '../data/storyHighlights.json';
import { createWebsiteGuide, GUIDE_SUGGESTIONS } from '../utils/websiteGuide';

const greeting = { id: 'welcome', role: 'assistant', text: 'Hi! I’m Jaz’s website guide. Ask me about Jaz, his programmes or getting started. I can share website information and links; this isn’t a live chat with Jaz.', links: [] };

function GuideDialog({ messages, onSend, onReset, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const sizeToViewport = () => {
      const viewport = window.visualViewport;
      dialog.style.setProperty('--guide-visible-height', `${viewport?.height || window.innerHeight}px`);
      dialog.style.setProperty('--guide-keyboard-inset', `${Math.max(0, window.innerHeight - (viewport?.height || window.innerHeight) - (viewport?.offsetTop || 0))}px`);
      dialog.dataset.compact = String((viewport?.height || window.innerHeight) < 520);
    };
    sizeToViewport();
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    window.visualViewport?.addEventListener('resize', sizeToViewport);
    window.visualViewport?.addEventListener('scroll', sizeToViewport);
    window.addEventListener('resize', sizeToViewport);
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      window.visualViewport?.removeEventListener('resize', sizeToViewport);
      window.visualViewport?.removeEventListener('scroll', sizeToViewport);
      window.removeEventListener('resize', sizeToViewport);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const log = logRef.current;
    const latest = log?.lastElementChild;
    if (log && latest) {
      log.scrollTop = Math.max(0, latest.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 16);
    }
  }, [messages]);

  const submit = (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    onSend(question);
    setInput('');
    inputRef.current?.focus();
  };

  return createPortal(
    <dialog ref={dialogRef} id="website-guide-panel" className="website-guide-dialog" aria-labelledby="website-guide-title" aria-describedby="website-guide-description" onCancel={onClose} onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      const controls = [...event.currentTarget.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled)')].filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <div className="guide-header">
        <span className="guide-avatar" aria-hidden="true"><i className="bi bi-chat-dots"></i></span>
        <div><h2 id="website-guide-title">Jaz’s website guide</h2><p id="website-guide-description">Website answers. Helpful links.</p></div>
        <button type="button" className="guide-close" onClick={onClose} aria-label="Close website guide" autoFocus><i className="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>
      <div className="guide-messages" ref={logRef} role="log" aria-label="Website guide conversation" aria-live="polite" aria-relevant="additions">
        {messages.map((message) => <div key={message.id} className={`guide-message guide-message-${message.role}`}>
          <span className="guide-message-label">{message.role === 'user' ? 'You' : 'Website guide'}</span>
          <p>{message.text}</p>
          {message.links?.length > 0 && <div className="guide-answer-links" aria-label="Related website pages">{message.links.map((item) => <Link to={item.to} key={item.to} onClick={onClose}>{item.label}<span aria-hidden="true">↗</span></Link>)}</div>}
        </div>)}
      </div>
      <div className="guide-suggestions" aria-label="Suggested questions">
        {(messages.length > 1 ? GUIDE_SUGGESTIONS.slice(0, 3) : GUIDE_SUGGESTIONS).map((question) => <button key={question} type="button" onClick={() => onSend(question)}>{question}</button>)}
      </div>
      <form className="guide-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="website-guide-question">Ask a question about this website</label>
        <div className="guide-input-row"><input ref={inputRef} id="website-guide-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={300} placeholder="Ask about Jaz…" autoComplete="off" enterKeyHint="send" /><button type="submit" disabled={!input.trim()} aria-label="Send question"><i className="bi bi-arrow-up" aria-hidden="true"></i></button></div>
        <div className="guide-form-note"><span>Website information only · not personal advice</span><button type="button" onClick={() => { onReset(); setInput(''); inputRef.current?.focus(); }}>Clear chat</button></div>
      </form>
    </dialog>, document.body
  );
}

export default function WebsiteGuide() {
  const programs = useProgrammes();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const nextId = useRef(0);
  const testimonials = useTestimonials();
  const answer = useMemo(() => createWebsiteGuide({ siteConfig, programs, testimonials, highlights }), [programs, testimonials]);

  const send = (question) => {
    const id = ++nextId.current;
    setMessages((current) => {
      const previousTopic = [...current].reverse().find((message) => message.role === 'assistant' && message.topic)?.topic;
      const response = answer(question, previousTopic);
      return [greeting, ...current.slice(1).slice(-16), { id: `question-${id}`, role: 'user', text: question }, { id: `answer-${id}`, role: 'assistant', ...response }];
    });
  };

  return <>
    <button type="button" className="website-guide-launcher" aria-label="Ask Jaz’s website guide" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? 'website-guide-panel' : undefined} onClick={() => setOpen(true)}><i className="bi bi-chat-dots" aria-hidden="true"></i><span className="floating-action-label" aria-hidden="true">Ask about Jaz</span></button>
    {open && <GuideDialog messages={messages} onSend={send} onReset={() => setMessages([greeting])} onClose={() => setOpen(false)} />}
  </>;
}
