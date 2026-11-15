import { storyText } from './testimonialBrowser.js';

export function featuredTestimonials(entries) {
  return entries.filter(entry => entry.featured === true);
}

export function featuredStoryCopy(testimonial, highlight = {}) {
  const copy = { ...highlight, ...testimonial };
  const text = storyText(testimonial.description || '');
  const shorten = count => {
    const words = text.split(/\s+/).filter(Boolean);
    return words.slice(0, count).join(' ') + (words.length > count ? '…' : '');
  };
  return {
    ...copy,
    headline: copy.headline || storyText(testimonial.title),
    focus: copy.focus || 'Client success story',
    summary: copy.summary || shorten(55),
    excerpt: copy.excerpt || shorten(35),
  };
}
