import test from 'node:test';
import assert from 'node:assert/strict';

function mockBrowser() {
  const scripts = [];
  globalThis.window = {};
  globalThis.document = {
    createElement: () => ({ dataset: {}, remove() { this.removed = true; } }),
    body: { appendChild(script) { scripts.push(script); } },
  };
  return scripts;
}

test('calendar and badge share one script request', async () => {
  const scripts = mockBrowser();
  try {
    const { loadCalendly } = await import('../src/utils/loadCalendly.js?shared');
    const first = loadCalendly();
    const second = loadCalendly();
    assert.equal(first, second);
    assert.equal(scripts.length, 1);
    const api = { initInlineWidget() {} };
    window.Calendly = api;
    scripts[0].onload();
    assert.equal(await first, api);
    assert.equal(await second, api);
  } finally { delete globalThis.window; delete globalThis.document; }
});

test('an existing Calendly API is reused without another script', async () => {
  const scripts = mockBrowser();
  try {
    const api = { initInlineWidget() {} };
    window.Calendly = api;
    const { loadCalendly } = await import('../src/utils/loadCalendly.js?existing');
    assert.equal(await loadCalendly(), api);
    assert.equal(scripts.length, 0);
  } finally { delete globalThis.window; delete globalThis.document; }
});

test('failed requests reject cleanly and permit a later retry', async () => {
  const scripts = mockBrowser();
  try {
    const { loadCalendly } = await import('../src/utils/loadCalendly.js?retry');
    const failure = assert.rejects(loadCalendly(), /could not be loaded/);
    scripts[0].onerror();
    await failure;
    assert.equal(scripts[0].removed, true);
    const retry = loadCalendly();
    assert.equal(scripts.length, 2);
    window.Calendly = { initInlineWidget() {} };
    scripts[1].onload();
    assert.equal(await retry, window.Calendly);
  } finally { delete globalThis.window; delete globalThis.document; }
});
