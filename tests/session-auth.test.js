import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionSettings, adminOrigin, requireSameOrigin, createSessionAuthenticator, permissionClaim } from '../server/session-auth.js';
const env = {
  AUTH0_DOMAIN: 'tenant.uk.auth0.com', AUTH0_CLIENT_ID: 'regular-client', AUTH0_CLIENT_SECRET: 'client-secret-that-must-stay-server-side', AUTH0_SECRET: 'session-encryption-secret-with-at-least-32-characters',
};
function oidcRequest(user) {
  return { headers: {}, oidc: { isAuthenticated: () => !!user, user } };
}
test('standard Vercel variables configure a regular web application without VITE variables', () => {
  const config = sessionSettings(env);
  assert.equal(config.clientID, env.AUTH0_CLIENT_ID);
  assert.equal(config.clientSecret, env.AUTH0_CLIENT_SECRET);
  assert.equal(config.issuer, 'https://tenant.uk.auth0.com');
  assert.equal(sessionSettings({ ...env, AUTH0_DOMAIN: 'https://tenant.uk.auth0.com/' }).issuer, config.issuer);
  assert.throws(() => sessionSettings({ ...env, AUTH0_CLIENT_ID: '' }), /AUTH0_CLIENT_ID/);
  assert.throws(() => sessionSettings({ ...env, AUTH0_SECRET: 'short' }), /32/);
});
test('callback origin only accepts configured origins and trusted Vercel hosts', () => {
  const vars = { VERCEL: '1', VERCEL_URL: 'deploy.vercel.app', VERCEL_BRANCH_URL: 'branch.vercel.app' };
  assert.equal(adminOrigin({ headers: { host: 'branch.vercel.app' } }, vars), 'https://branch.vercel.app');
  assert.throws(() => adminOrigin({ headers: { host: 'attacker.example', 'x-forwarded-host': 'branch.vercel.app' } }, vars));
  assert.equal(adminOrigin({ headers: {} }, {}), 'http://localhost:3000');
  assert.equal(adminOrigin({ headers: {} }, { AUTH0_BASE_URL: 'https://studio.example' }), 'https://studio.example');
  assert.throws(() => adminOrigin({ headers: {} }, { AUTH0_BASE_URL: 'https://attacker@studio.example/path' }));
});
test('cookie-authenticated mutations reject absent or cross-site origins', () => {
  for (const origin of [undefined, 'https://attacker.example']) assert.throws(() => requireSameOrigin({ method: 'POST', headers: { origin } }, 'https://studio.example'), e => e.status === 403);
  assert.doesNotThrow(() => requireSameOrigin({ method: 'POST', headers: { origin: 'https://studio.example' } }, 'https://studio.example'));
});
test('a signed-in but unapproved user remains blocked', async () => {
  const check = createSessionAuthenticator({ env });
  await assert.rejects(check(oidcRequest(null)), e => e.status === 401);
  await assert.rejects(check(oidcRequest({ sub: 'auth0|pending', user_metadata: { permissions: ['manage:content'] } })), e => e.status === 403);
  const identity = await check(oidcRequest({ sub: 'auth0|admin', [permissionClaim]: ['manage:content'] }));
  assert.equal(identity.sub, 'auth0|admin');
});
test('management credentials check assigned permissions for the content API and remain server-only', async () => {
  const calls = [];
  const managementEnv = { ...env, AUTH0_MANAGEMENT_API_CLIENT_ID: 'management-client', AUTH0_MANAGEMENT_API_CLIENT_SECRET: 'private-management-secret' };
  const check = createSessionAuthenticator({ env: managementEnv, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => url.endsWith('/oauth/token') ? { access_token: 'server-only-management-token', expires_in: 600 } : [{ permission_name: 'manage:content', resource_server_identifier: 'https://atm-content-studio-api' }] };
  } });
  const identity = await check(oidcRequest({ sub: 'auth0|admin', email: 'admin@example.com' }));
  await check(oidcRequest({ sub: 'auth0|other' }));
  assert.equal(identity.sub, 'auth0|admin');
  assert.equal(calls.filter(c => c.url.endsWith('/oauth/token')).length, 1);
  assert.equal(JSON.parse(calls[0].options.body).client_secret, managementEnv.AUTH0_MANAGEMENT_API_CLIENT_SECRET);
  assert.ok(calls[1].url.includes('auth0%7Cadmin/permissions'));
  assert.equal(calls[1].options.headers.Authorization, 'Bearer server-only-management-token');
  assert.equal(JSON.stringify(identity).includes('secret'), false);
  assert.equal(JSON.stringify(identity).includes('token'), false);
});
test('permissions from other APIs and failed Management API calls do not grant access', async () => {
  const managementEnv = { ...env, AUTH0_MANAGEMENT_API_CLIENT_ID: 'management-client', AUTH0_MANAGEMENT_API_CLIENT_SECRET: 'private' };
  const check = createSessionAuthenticator({ env: managementEnv, fetchImpl: async url => ({ ok: true, json: async () => url.endsWith('/oauth/token') ? { access_token: 'token', expires_in: 600 } : [{ permission_name: 'manage:content', resource_server_identifier: 'https://other-api' }] }) });
  await assert.rejects(check(oidcRequest({ sub: 'auth0|pending' })), e => e.status === 403);
  const broken = createSessionAuthenticator({ env: managementEnv, fetchImpl: async () => ({ ok: false }) });
  await assert.rejects(broken(oidcRequest({ sub: 'auth0|pending' })), e => e.status === 503);
});
