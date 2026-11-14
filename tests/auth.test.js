import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateAdmin, createSessionAuthenticator, neonAuthSettings, sessionIdentity } from '../server/auth.js';
const env = { NEON_AUTH_BASE_URL: 'https://example.neonauth.neon.tech/neondb/auth', NEON_AUTH_COOKIE_SECRET: 'test-only-cookie-secret-at-least-32-characters' };
const session = (user = {}) => ({ user: { id: 'neon-user', name: 'Admin', email: 'admin@example.com', ...user }, session: { userId: 'neon-user', expiresAt: new Date(Date.now() + 60000).toISOString(), token: 'private-session-token' } });
test('Neon requires HTTPS and a strong cookie secret', () => {
  assert.equal(neonAuthSettings(env).baseUrl, env.NEON_AUTH_BASE_URL);
  for (const override of [{ NEON_AUTH_BASE_URL: '' }, { NEON_AUTH_BASE_URL: 'http://evil.example/auth' }, { NEON_AUTH_BASE_URL: 'https://user:pass@example.com/auth' }, { NEON_AUTH_COOKIE_SECRET: 'short' }]) {
    assert.throws(() => neonAuthSettings({ ...env, ...override }), error => error.status === 503);
  }
  assert.equal(neonAuthSettings({ VITE_NEON_AUTH_URL: env.NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET: env.NEON_AUTH_COOKIE_SECRET }).baseUrl, env.NEON_AUTH_BASE_URL);
});
test('identities require matching, unexpired verified sessions', () => {
  assert.deepEqual(sessionIdentity(session()), { sub: 'neon-user', user: { sub: 'neon-user', name: 'Admin', email: 'admin@example.com' } });
  for (const value of [null, { user: { id: 'neon-user' } }, { ...session(), session: { userId: 'someone-else', expiresAt: new Date(Date.now() + 60000) } }, { ...session(), session: { userId: 'neon-user', expiresAt: '2000-01-01' } }]) {
    assert.throws(() => sessionIdentity(value), error => error.status === 401);
  }
});
test('signup and editable metadata never grant content approval', async () => {
  const authorize = createSessionAuthenticator({ env: {}, getDatabase: () => async () => [] });
  await assert.rejects(authorize({ authSession: session({ user_metadata: { role: 'admin' }, role: 'user' }) }), error => error.status === 403);
});
test('trusted admin role, explicit owner and memberships grant approval', async () => {
  for (const setup of [{ env: { ADMIN_PROJECT_OWNER_SUB: 'neon-user' } }, { env: { ADMIN_USER_IDS: 'other, neon-user' } }, { role: 'user,admin' }]) {
    const authorize = createSessionAuthenticator({ env: setup.env || {}, getDatabase: () => { throw new Error('No database needed'); } });
    assert.equal((await authorize({ authSession: session({ role: setup.role }) })).sub, 'neon-user');
  }
  const queries = [];
  const authorize = createSessionAuthenticator({ env: {}, getDatabase: () => async (strings, ...values) => { queries.push(values); return [{ project_id: 'mine' }]; } });
  assert.equal((await authorize({ authSession: session() })).sub, 'neon-user');
  assert.deepEqual(queries, [['neon-user']]);
});
test('unconfigured adapters deny obsolete bearer credentials', async () => {
  await assert.rejects(authenticateAdmin({ headers: { authorization: 'Bearer obsolete-token' } }), error => error.status === 503);
});
