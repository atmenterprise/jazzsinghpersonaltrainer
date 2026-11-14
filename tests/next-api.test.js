import test from 'node:test';
import assert from 'node:assert/strict';
import { createNextAdminApi } from '../server/next-api.js';
function request(path, options = {}) { return new Request(`http://localhost:3000/api/admin/${path}`, options); }
const session = (id = 'neon-user') => ({ data: { user: { id, email: 'admin@example.com', name: 'Admin' }, session: { userId: id, expiresAt: new Date(Date.now() + 60000).toISOString(), token: 'private-session-token' } } });
const env = { ADMIN_USER_IDS: 'neon-user' };
test('anonymous status returns JSON without database access or secrets', async () => {
  const route = createNextAdminApi({ env: {}, getSession: async () => ({ data: null }), getDatabase: () => { throw new Error('Database must not run'); } });
  const status = await route(request('auth/status'));
  assert.equal(status.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await status.json(), { configured: true, authenticated: false });
  assert.equal((await route(request('projects'))).status, 401);
});
test('obsolete access flags, bearer tokens and identity headers cannot bypass Neon', async () => {
  const route = createNextAdminApi({ env: { ADMIN_AUTH_DISABLED: 'true' }, getSession: async () => ({ data: null }), getDatabase: () => { throw new Error('Database must not run'); } });
  const response = await route(request('projects', { headers: { authorization: 'Bearer obsolete-token', cookie: 'atm_next_session=old', 'x-user-id': 'neon-user', 'x-user-role': 'admin' } }));
  assert.equal(response.status, 401);
});
test('Neon outages and missing configuration fail closed with JSON', async () => {
  for (const options of [{}, { getSession: async () => ({ data: null, error: { message: 'upstream-secret' } }) }, { getSession: async () => { throw new Error('private-connection-string'); } }]) {
    const route = createNextAdminApi({ env, ...options });
    const response = await route(request('auth/status'));
    assert.equal(response.status, 503);
    assert.doesNotMatch(JSON.stringify(await response.json()), /upstream-secret|private-connection-string/);
  }
});
test('status distinguishes pending and approved users without session tokens', async () => {
  const getSession = async () => session();
  const pendingRoute = createNextAdminApi({ env: {}, getSession, getDatabase: () => async () => [] });
  const pending = await (await pendingRoute(request('auth/status'))).json();
  assert.equal(pending.authenticated, true);
  assert.equal(pending.approved, false);
  assert.equal((await pendingRoute(request('projects'))).status, 403);
  const route = createNextAdminApi({ env, getSession });
  const approved = await (await route(request('auth/status'))).json();
  assert.equal(approved.approved, true);
  assert.equal(approved.user.sub, 'neon-user');
  assert.doesNotMatch(JSON.stringify(approved), /private-session-token/);
});
test('approved accounts still require membership and same-origin writes', async () => {
  const queries = [];
  const route = createNextAdminApi({ env, getSession: async () => session(), getDatabase: () => async (strings, ...values) => { queries.push({ text: strings.join('?'), values }); return []; } });
  assert.equal((await route(request('images?project=other'))).status, 403);
  assert.match(queries[0].text, /admin_project_members/);
  assert.deepEqual(queries[0].values, ['other', 'neon-user']);
  const count = queries.length;
  assert.equal((await route(request('projects', { method: 'POST', headers: { origin: 'https://evil.example' } }))).status, 403);
  assert.equal(queries.length, count);
});
test('body limits and malformed JSON remain enforced after authentication', async () => {
  const route = createNextAdminApi({ env, getSession: async () => session(), getDatabase: () => { throw new Error('No database expected'); } });
  const headers = { origin: 'http://localhost:3000', 'content-type': 'application/json' };
  assert.equal((await route(request('projects', { method: 'POST', headers, body: 'x'.repeat(100001) }))).status, 413);
  assert.equal((await route(request('projects', { method: 'POST', headers, body: '{broken' }))).status, 400);
});
