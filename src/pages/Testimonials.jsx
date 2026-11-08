import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import testimonials from '../data/testimonials.json';
import ProgramLayout from '../components/ProgramLayout';
import TestimonialCard from '../components/TestimonialCard';
import StoryModal from '../components/StoryModal';
import { browseStories } from '../utils/testimonialBrowser';

export default function Testimonials() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(null);
  const resultsRef = useRef(null);
  const query = params.get('q') || '';
  const featured = params.get('view') === 'featured';
  const sort = params.get('sort') === 'original' ? 'original' : 'latest';
  const requestedPage = params.get('page') || 1;
  const result = useMemo(() => browseStories(testimonials, { query, featured, sort, page: requestedPage }), [query, featured, sort, requestedPage]);
  const selected = testimonials.find((entry) => entry.id === selectedId);
  const featuredCount = testimonials.filter((entry) => entry.featured).length;

  useEffect(() => {
    const match = location.hash.match(/^#story-(\d+)$/);
    setSelectedId(match ? Number(match[1]) : null);
  }, [location.hash]);

  const update = (changes) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('page');
      Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  const changePage = (page) => {
    update({ page: String(page) });
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  };

  return (
    <ProgramLayout>
      <main className="testimonials-page">
        <header className="testimonials-hero" aria-labelledby="testimonials-title">
          <div className="container">
            <span className="section-eyebrow">Personal support. Everyday progress.</span>
            <h1 id="testimonials-title">Client Success Stories</h1>
            <p>Hear from my clients their own success stories over the years and how I have helped them achieve their goals.</p>
            <a href="/booking#book" className="btn btn-primary btn-lg">Book Your Complimentary Consultation</a>
          </div>
        </header>
        <section className="stories-browser" aria-label="Browse client testimonials">
          <div className="container">
            <div className="stories-toolbar">
              <div className="stories-search">
                <label htmlFor="story-search">Find a story</label>
                <div><i className="bi bi-search" aria-hidden="true"></i><input id="story-search" type="search" value={query} onChange={(event) => update({ q: event.target.value })} placeholder="Search by name, goal or experience" /></div>
              </div>
              <div className="stories-sort">
                <label htmlFor="story-sort">Sort stories</label>
                <div className="stories-select-control">
                  <select id="story-sort" value={sort} onChange={(event) => update({ sort: event.target.value === 'latest' ? '' : event.target.value })}>
                    <option value="latest">Latest added</option>
                    <option value="original">Original order</option>
                  </select>
                  <i className="bi bi-chevron-down" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="stories-browse-meta">
              <div className="stories-filters" role="group" aria-label="Filter stories"><button type="button" aria-pressed={!featured} onClick={() => update({ view: '' })}>All stories <span>{testimonials.length}</span></button><button type="button" aria-pressed={featured} onClick={() => update({ view: 'featured' })}>Featured <span>{featuredCount}</span></button></div>
              <p role="status" aria-live="polite">{result.total ? `${result.start + 1}–${result.start + result.entries.length} of ${result.total} stories` : 'No matching stories'}</p>
            </div>
            <h2 className="sr-only" id="stories-results-title" ref={resultsRef} tabIndex={-1}>Client stories</h2>
            {result.total ? <>
              <div className="stories-grid browse-stories-grid">{result.entries.map((entry) => <TestimonialCard entry={entry} key={entry.id} onRead={(entry) => setSelectedId(entry.id)} />)}</div>
              {result.pageCount > 1 && <nav className="stories-pagination" aria-label="Story pages"><button type="button" disabled={result.page === 1} onClick={() => changePage(result.page - 1)}>← Previous</button><span>Page {result.page} of {result.pageCount}</span><button type="button" disabled={result.page === result.pageCount} onClick={() => changePage(result.page + 1)}>Next →</button></nav>}
            </> : <div className="stories-empty"><i className="bi bi-search" aria-hidden="true"></i><h2>No stories found</h2><p>Try a different name or keyword, or browse all client stories.</p><button type="button" className="btn btn-default" onClick={() => update({ q: '', view: '' })}>Clear filters</button></div>}
            <div className="stories-cta"><h2>Your results begin with a complimentary consultation.</h2><a href="/booking#book" className="btn btn-primary btn-lg">Book Today &raquo;</a></div>
          </div>
        </section>
      </main>
      {selected && <StoryModal key={selected.id} entry={selected} onClose={() => setSelectedId(null)} />}
    </ProgramLayout>
  );
}
