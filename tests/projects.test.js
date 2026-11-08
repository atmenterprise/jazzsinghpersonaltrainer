import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createHandler } from '../server/handler.js';
import { validateProject } from '../server/projects.js';
import { projectAssetUrl } from '../src/admin/projectAssets.js';
const subject = 'auth0|project-owner';
async function request(sql, method, path, body) {
  const req = Readable.from(body ? [JSON.stringify(body)] : []);
  Object.assign(req, { method, url: `/api/admin/${path}`, headers: { 'content-type': 'application/json' } });
  const res = { setHeader() {}, end(value) { this.body = JSON.parse(value); } };
  await createHandler(() => sql, async () => ({ sub: subject }))(req, res);
  return res;
}
test('project origins are normalized and cannot contain credentials or paths', () => {
  assert.deepEqual(validateProject({ id: 'acme', name: ' Acme ', domain: 'https://EXAMPLE.COM/' }), { id: 'acme', name: 'Acme', domain: 'https://example.com' });
  for (const domain of ['https://user:pass@example.com', 'javascript:alert(1)', 'http://example.com', 'https://example.com/path', 'https://example.com/?a=1']) {
    assert.throws(() => validateProject({ id: 'acme', name: 'Acme', domain }));
  }
  assert.throws(() => validateProject({ id: '../another', name: 'Acme', domain: 'https://example.com' }));
  assert.equal(validateProject({ id: 'local', name: 'Local', domain: 'http://localhost:5173' }).domain, 'http://localhost:5173');
});
test('content requires a project and membership for every operation', async () => {
  const queries = [];
  const sql = (strings, ...values) => { queries.push({ text: strings.join('?'), values }); return []; };
  assert.equal((await request(sql, 'GET', 'images')).statusCode, 400);
  assert.equal(queries.length, 0);
  const id = 'ce1dccaf-029d-49f8-b439-bc47e80c045b';
  const data = { label: 'Image', location: 'Home', url: '/images/hero.jpg' };
  for (const [method, path, body] of [['GET', 'images'], ['GET', `images/${id}`], ['POST', 'images', { data }], ['PUT', `images/${id}`, { data, version: 1 }], ['DELETE', `images/${id}`, { version: 1 }]]) {
    const result = await request(sql, method, `${path}?project=other-site`, body);
    assert.equal(result.statusCode, 403);
  }
  assert.ok(queries.every(q => q.text.includes('admin_project_members') && q.values.includes(subject) && q.values.includes('other-site')));
});
test('content reads, inserts, updates and deletes are scoped to selected project', async () => {
  const queries = [];
  const sql = (strings, ...values) => {
    const text = strings.join('?'); queries.push({ text, values });
    return text.includes('admin_project_members') ? [{ project_id: 'acme' }] : [{ id: 'record' }];
  };
  const id = 'ce1dccaf-029d-49f8-b439-bc47e80c045b';
  const data = { label: 'Image', location: 'Home', url: '/images/hero.jpg' };
  for (const [method, path, body] of [['GET', 'images'], ['POST', 'images', { data }], ['PUT', `images/${id}`, { data, version: 1 }], ['DELETE', `images/${id}`, { version: 1 }]]) {
    assert.ok((await request(sql, method, `${path}?project=acme`, body)).statusCode < 300);
  }
  for (const q of queries.filter(q => q.text.includes('admin_content'))) {
    assert.ok(q.text.includes('project_id'));
    assert.ok(q.values.includes('acme'));
    assert.equal(q.text.includes('acme'), false);
  }
});
test('project listing only returns memberships for the signed-in subject', async () => {
  const queries = [];
  const sql = (strings, ...values) => { queries.push({ text: strings.join('?'), values }); return [{ id: 'acme', domain: 'https://example.com' }]; };
  const result = await request(sql, 'GET', 'projects');
  assert.equal(result.statusCode, 200);
  assert.ok(queries[0].text.includes('JOIN admin_project_members'));
  assert.deepEqual(queries[0].values, [subject]);
});
test('project creation grants the authenticated creator membership atomically', async () => {
  const queries = [];
  let transaction;
  const sql = (strings, ...values) => { const query = { text: strings.join('?'), values }; queries.push(query); return query; };
  sql.transaction = async statements => { transaction = statements; return [[{ id: 'acme', name: 'Acme', domain: 'https://example.com' }], []]; };
  const response = await request(sql, 'POST', 'projects', { data: { id: 'acme', name: 'Acme', domain: 'https://example.com', auth0_sub: 'attacker' } });
  assert.equal(response.statusCode, 201);
  assert.equal(transaction.length, 2);
  assert.ok(queries[1].text.includes('admin_project_members'));
  assert.deepEqual(queries[1].values, ['acme', subject]);
});
test('relative images resolve against their project domain', () => {
  assert.equal(projectAssetUrl('img/profile.jpg', 'https://acme.example'), 'https://acme.example/img/profile.jpg');
  assert.equal(projectAssetUrl('/assets/photo.png', 'https://other.example'), 'https://other.example/assets/photo.png');
  assert.equal(projectAssetUrl('https://cdn.example/photo.png', 'https://acme.example'), 'https://cdn.example/photo.png');
});
