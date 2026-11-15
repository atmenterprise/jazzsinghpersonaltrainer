import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browseStories, storyText, STORIES_PER_PAGE } from '../src/utils/testimonialBrowser.js';

const entries = JSON.parse(readFileSync(new URL('../src/data/testimonials.json', import.meta.url), 'utf8'));

test('pagination makes every story reachable exactly once', () => {
  const first = browseStories(entries);
  const ids = [];
  for (let page = 1; page <= first.pageCount; page++) {
    const result = browseStories(entries, { page });
    assert.ok(result.entries.length <= STORIES_PER_PAGE);
    ids.push(...result.entries.map((entry) => entry.id));
  }
  assert.equal(new Set(ids).size, entries.length);
  assert.deepEqual([...ids].sort((a, b) => a - b), entries.map((entry) => entry.id).sort((a, b) => a - b));
});

test('search supports names, multiple words and case-insensitive queries', () => {
  assert.deepEqual(browseStories(entries, { query: '  AMARJIT  ' }).matches.map((entry) => entry.id), [1]);
  const result = browseStories(entries, { query: 'Natasha technique' });
  assert.deepEqual(result.matches.map((entry) => entry.id), [5]);
});

test('featured filtering and searching work together', () => {
  const result = browseStories(entries, { featured: true, query: 'Pam' });
  assert.deepEqual(result.matches.map((entry) => entry.id), [22]);
  assert.equal(browseStories(entries, { featured: true }).total, entries.filter((entry) => entry.featured).length);
});

test('empty results and invalid page numbers are handled', () => {
  const result = browseStories(entries, { query: 'no-such-client-xyz', page: 999 });
  assert.equal(result.total, 0);
  assert.equal(result.page, 1);
  assert.deepEqual(result.entries, []);
  assert.equal(browseStories(entries, { page: -5 }).page, 1);
  assert.equal(browseStories(entries, { page: 'invalid' }).page, 1);
  assert.equal(browseStories(entries, { page: 999 }).page, browseStories(entries).pageCount);
});

test('sorting preserves the source data and distinguishes newly appended stories', () => {
  const original = entries.map((entry) => entry.id);
  assert.equal(browseStories(entries).entries[0].id, entries.at(-1).id);
  assert.equal(browseStories(entries, { sort: 'original' }).entries[0].id, entries[0].id);
  assert.deepEqual(entries.map((entry) => entry.id), original);
  const grown = [...entries, { id: 1000, testimonial: { author: 'New client', title: 'New story', description: 'My progress.' } }];
  assert.equal(browseStories(grown).entries[0].id, 1000);
});

test('encoded punctuation remains readable without rendering HTML', () => {
  assert.equal(storyText(' Jaz&#39;s help &amp; support '), "Jaz's help & support");
  assert.equal(storyText('<script>text</script>'), '<script>text</script>');
});
