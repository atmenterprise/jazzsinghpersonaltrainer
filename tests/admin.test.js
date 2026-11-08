import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createHandler as contentHandler } from '../server/handler.js';
import { AuthError } from '../server/auth.js';
import { validate, safeUrl } from '../server/content.js';
const secret = 'test-secret-with-at-least-32-characters';
const createHandler = getDatabase => contentHandler(getDatabase, async req => {
  if (req.headers.authorization !== `Bearer ${secret}`) throw new AuthError(401, 'Sign in required.');
  return { sub: 'auth0|test-admin' };
}, async () => true);
async function request(handler, method, path, body, token = secret, contentType = 'application/json') {
  const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)]);
  Object.assign(req, { method, url: `/api/admin/${path}?project=test-project`, headers: { authorization: `Bearer ${token}`, 'content-type': contentType } });
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res);
  return res;
}
test('authentication and route validation block database access', async () => {
  const handler = createHandler(() => { throw new Error('Must not access database'); });
  assert.equal((await request(handler, 'GET', 'images', undefined, 'wrong')).statusCode, 401);
  assert.equal((await request(handler, 'GET', 'unknown')).statusCode, 404);
  assert.equal((await request(handler, 'PUT', 'images/not-a-uuid', {})).statusCode, 404);
  assert.equal((await request(handler, 'POST', 'images', {}, secret, 'text/plain')).statusCode, 415);
});
test('validates URLs, required fields, types and strips unexpected fields', () => {
  assert.equal(safeUrl('javascript:alert(1)', true), false);
  assert.equal(safeUrl('//host.example/image.jpg', true), false);
  assert.equal(safeUrl('img/../secret', true), false);
  assert.throws(() => validate('testimonials', { author: 'Jaz' }), /title/);
  assert.throws(() => validate('testimonials', { title: 'Story', author: 'Client', description: 'Text', featured: 'true' }), /boolean/);
  const data = validate('images', { label: 'Portrait', location: 'Home', url: 'https://example.com/portrait.jpg', secret: 'ignored' });
  assert.equal(data.secret, undefined);
});
test('CRUD uses parameterized queries and reports write conflicts', async () => {
  const id = 'ce1dccaf-029d-49f8-b439-bc47e80c045b';
  const queries = [];
  let result = [];
  const handler = createHandler(() => (strings, ...values) => { queries.push({ text: strings.join('?'), values }); return result; });
  const data = { label: "Photo '); DROP TABLE admin_content; --", location: 'Home', url: 'img/profile/profile.jpg', alt: '' };
  result = [{ id, data, version: 1 }];
  const created = await request(handler, 'POST', 'images', { data });
  assert.equal(created.statusCode, 201);
  assert.equal(queries[0].text.includes(data.label), false);
  assert.equal(JSON.parse(queries[0].values[2]).label, data.label);
  assert.equal((await request(handler, 'GET', 'images')).body.length, 1);
  result = [{ id, data, version: 2 }];
  assert.equal((await request(handler, 'PUT', `images/${id}`, { data, version: 1 })).body.version, 2);
  result = [];
  assert.equal((await request(handler, 'PUT', `images/${id}`, { data, version: 1 })).statusCode, 409);
  assert.equal((await request(handler, 'DELETE', `images/${id}`, { version: 1 })).statusCode, 409);
  result = [{ id }];
  assert.equal((await request(handler, 'DELETE', `images/${id}`, { version: 2 })).body.deleted, true);
});
test('database errors do not leak credentials or internals', async () => {
  const handler = createHandler(() => { throw new Error('postgresql://secret:password@host'); });
  const response = await request(handler, 'GET', 'images');
  assert.equal(response.statusCode, 503);
  assert.equal(JSON.stringify(response.body).includes('password'), false);
  assert.equal(response.headers['Cache-Control'], 'no-store');
});
