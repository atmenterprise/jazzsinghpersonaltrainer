import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validate } from '../server/content.js';
import { programmeBlocks, programmeSections } from '../src/utils/programmeCopy.js';

const pages = JSON.parse(await readFile(new URL('../src/data/programmePages.json', import.meta.url)));

test('all four existing programme pages are seeded with valid content', () => {
  assert.deepEqual(pages.map(page => page.page_url), ['onetoonept', 'couplept', 'onlinept', 'nutritionpt']);
  for (const page of pages) assert.deepEqual(validate('programme_pages', page), page);
});

test('seeded copy preserves original page wording and list items', async () => {
  const files = ['Onetoonept', 'Couplept', 'Onlinept', 'Nutritionpt'];
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  for (const [index, page] of pages.entries()) {
    const source = await readFile(new URL(`../src/site-pages/${files[index]}.jsx`, import.meta.url), 'utf8');
    const sourceCopy = [...source.matchAll(/<(?:p|li) className="[^"]+">([\s\S]*?)<\/(?:p|li)>/g)]
      .map(match => normalize(match[1].replace(/<[^>]*>/g, '')));
    const storedCopy = [page.introduction, ...programmeSections(page).map(section => section.text)]
      .join(' ').replace(/\[([^\]]+)\]\(\/booking#book\)/g, '$1').replace(/- /g, '');
    for (const paragraph of sourceCopy) assert.ok(normalize(storedCopy).includes(paragraph), paragraph);
    assert.equal(programmeSections(page).flatMap(section => programmeBlocks(section.text)).filter(block => block.type === 'list').reduce((count, block) => count + block.items.length, 0), (source.match(/<li /g) || []).length);
  }
});

test('editable content supports paragraphs and lists; empty sections stay hidden', () => {
  assert.deepEqual(programmeBlocks('Intro\n\n- First\n- Second\n\nEnd').map(block => block.type), ['paragraph', 'list', 'paragraph']);
  assert.deepEqual(programmeBlocks('- First\n- Second')[0].items, ['First', 'Second']);
  const sections = programmeSections({ ...pages[0], results_content: '' });
  assert.deepEqual(sections.map(section => section.id), ['who-its-for', 'whats-included', 'your-investment']);
});
