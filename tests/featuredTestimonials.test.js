import test from 'node:test';
import assert from 'node:assert/strict';
import { featuredTestimonials, featuredStoryCopy } from '../src/utils/featuredTestimonials.js';

test('adding and removing featured status changes homepage selection without deleting stories', () => {
  const entries = [{ id: 1, featured: true }, { id: 2, featured: false }];
  assert.deepEqual(featuredTestimonials(entries).map(row => row.id), [1]);
  entries[1].featured = true;
  assert.equal(featuredTestimonials(entries).length, 2);
  entries[0].featured = false;
  assert.deepEqual(featuredTestimonials(entries).map(row => row.id), [2]);
  assert.equal(entries.length, 2);
});

test('any testimonial can be featured without optional homepage copy', () => {
  const copy = featuredStoryCopy({ title: 'New story', description: 'A client story', headline: '', summary: '', excerpt: '', focus: '' });
  assert.equal(copy.headline, 'New story');
  assert.equal(copy.summary, 'A client story');
  assert.equal(copy.excerpt, 'A client story');
  assert.equal(copy.focus, 'Client success story');
});

test('custom homepage copy and existing journey content are preserved', () => {
  const journey = [{ label: 'Progress', text: 'Original content' }];
  const copy = featuredStoryCopy({ title: 'Title', description: 'Description', headline: 'Custom headline', summary: 'Custom summary', excerpt: 'Custom excerpt' }, { journey });
  assert.equal(copy.headline, 'Custom headline');
  assert.equal(copy.summary, 'Custom summary');
  assert.equal(copy.excerpt, 'Custom excerpt');
  assert.deepEqual(copy.journey, journey);
});
