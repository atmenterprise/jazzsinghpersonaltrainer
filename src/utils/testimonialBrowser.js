export const STORIES_PER_PAGE = 6;

export function storyText(value = '') {
  return value.replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
}

export function browseStories(entries, { query = '', featured = false, sort = 'latest', page = 1 } = {}) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let matches = entries.filter((entry) => {
    if (featured && !entry.featured) return false;
    const text = storyText(`${entry.testimonial.author} ${entry.testimonial.title} ${entry.testimonial.description}`).toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
  if (sort === 'latest') matches = [...matches].reverse();
  const pageCount = Math.max(1, Math.ceil(matches.length / STORIES_PER_PAGE));
  const currentPage = Math.min(pageCount, Math.max(1, Math.floor(Number(page) || 1)));
  const start = (currentPage - 1) * STORIES_PER_PAGE;
  return { matches, entries: matches.slice(start, start + STORIES_PER_PAGE), total: matches.length, pageCount, page: currentPage, start };
}
