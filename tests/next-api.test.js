import test from 'node:test';
import assert from 'node:assert/strict';
import { createNextAdminApi } from '../server/next-api.js';
import { permissionClaim } from '../server/session-auth.js';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { NextRequest } from 'next/server.js';
const env = { ADMIN_AUTH_DISABLED: 'false', AUTH0_CLIENT_ID: 'regular-client', AUTH0_CLIENT_SECRET: 'server-only-client-secret', AUTH0_SECRET: 'server-only-session-secret-at-least-32-characters', AUTH0_DOMAIN: 'tenant.uk.auth0.com' };
function request(path, options = {}) { return new Request(`http://localhost:3000/api/admin/${path}`, options); }
test('Next session endpoint returns JSON with no credentials or database access', async () => {
  const route = createNextAdminApi({ env, getSession: async () => null, getDatabase: () => { throw new Error('Database should not be called'); } });
  const response = await route(request('auth/status'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), { configured: true, authenticated: false });
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('Next API reports missing configuration as JSON without leaking secrets', async () => {
  const route = createNextAdminApi({ env: { ...env, AUTH0_CLIENT_ID: '' }, getSession: async () => null });
  const response = await route(request('auth/status'));
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.match(body.error, /AUTH0_CLIENT_ID/);
  assert.equal(JSON.stringify(body).includes(env.AUTH0_CLIENT_SECRET), false);
});
test('Next session endpoint distinguishes signed-in pending and approved accounts', async () => {
  let user = { sub: 'auth0|user', email: 'admin@example.com' };
  const route = createNextAdminApi({ env, getSession: async () => ({ user, tokenSet: { accessToken: 'private-access-token' } }) });
  const pending = await (await route(request('auth/status'))).json();
  assert.equal(pending.authenticated, true);
  assert.equal(pending.approved, false);
  user = { ...user, [permissionClaim]: ['manage:content'] };
  const approved = await (await route(request('auth/status'))).json();
  assert.equal(approved.approved, true);
  assert.equal(JSON.stringify(approved).includes('private-access-token'), false);
});
test('Next content adapter enforces same-origin writes and membership', async () => {
  const user = { sub: 'auth0|user', [permissionClaim]: ['manage:content'] };
  const queries = [];
  const sql = (strings, ...values) => { queries.push({ text: strings.join('?'), values }); return []; };
  const route = createNextAdminApi({ env, getSession: async () => ({ user }), getDatabase: () => sql });
  const denied = await route(request('images?project=other', { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: '{}' }));
  assert.equal(denied.status, 403);
  assert.equal(queries.length, 0);
  const forbidden = await route(request('images?project=other'));
  assert.equal(forbidden.status, 403);
  assert.equal(queries.length, 1);
  assert.match(queries[0].text, /admin_project_members/);
});
test('Next API rejects oversized bodies and invalid JSON', async () => {
  const user = { sub: 'auth0|user', [permissionClaim]: ['manage:content'] };
  const route = createNextAdminApi({ env, getSession: async () => ({ user }) });
  const headers = { origin: 'http://localhost:3000', 'content-type': 'application/json' };
  assert.equal((await route(request('images?project=test', { method: 'POST', headers, body: 'x'.repeat(100001) }))).status, 413);
  assert.equal((await route(request('images?project=test', { method: 'POST', headers, body: '{broken' }))).status, 400);
});
test('real Next.js Auth0 SDK rejects forged encrypted session cookies', async () => {
  const client = new Auth0Client({ domain: env.AUTH0_DOMAIN, clientId: env.AUTH0_CLIENT_ID, clientSecret: env.AUTH0_CLIENT_SECRET, secret: env.AUTH0_SECRET, appBaseUrl: 'http://localhost:3000', session: { cookie: { name: 'atm_next_session' } } });
  const session = await client.getSession(new NextRequest('http://localhost:3000/admin', { headers: { cookie: 'atm_next_session=forged-cookie' } }));
  assert.equal(session, null);
});

test('temporary access skips Auth0 and memberships while preserving origin checks', async () => {
  const queries = [];
  const route = createNextAdminApi({
    env: {},
    getSession: async () => { throw new Error('Auth0 must not run'); },
    getDatabase: () => (strings) => { queries.push(strings.join('?')); return []; },
  });
  const status = await (await route(request('auth/status'))).json();
  assert.equal(status.approved, true);
  assert.equal((await route(request('projects'))).status, 200);
  assert.equal((await route(request('images?project=jazboom'))).status, 200);
  assert.equal(queries.some(query => query.includes('admin_project_members')), false);
  const denied = await route(request('projects', { method: 'POST', headers: { origin: 'https://evil.example' } }));
  assert.equal(denied.status, 403);
});
