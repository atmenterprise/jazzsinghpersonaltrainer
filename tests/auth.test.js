import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose';
import { createAdminAuthenticator } from '../server/auth.js';
import { createHandler } from '../server/handler.js';

const issuer = 'https://test.uk.auth0.com/';
const audience = 'https://jazboom-admin-api';
const { publicKey, privateKey } = await generateKeyPair('RS256');
const jwk = { ...await exportJWK(publicKey), kid: 'test-key' };
const authenticate = createAdminAuthenticator({ env: { AUTH0_DOMAIN: 'test.uk.auth0.com', AUTH0_AUDIENCE: audience }, resolveKey: createLocalJWKSet({ keys: [jwk] }) });
async function token({ claims = {}, aud = audience, iss = issuer, exp = '5m', key = privateKey, algorithm = 'RS256' } = {}) {
  return new SignJWT({ permissions: ['manage:content'], ...claims })
    .setProtectedHeader({ alg: algorithm, kid: 'test-key' }).setIssuer(iss).setAudience(aud)
    .setSubject(claims.sub || 'auth0|approved-admin').setIssuedAt().setExpirationTime(exp).sign(key);
}
async function request(bearer, path = 'session', method = 'GET', body) {
  let dbCalls = 0;
  const handler = createHandler(() => { dbCalls++; return strings => strings.join('').includes('admin_project_members') ? [{ project_id: 'test-project' }] : []; }, authenticate);
  const req = Readable.from(body ? [JSON.stringify(body)] : []);
  Object.assign(req, { url: `/api/admin/${path}?project=test-project`, method, headers: { 'content-type': 'application/json', ...(bearer ? { authorization: `Bearer ${bearer}` } : {}) } });
  const res = { headers: {}, setHeader(k,v) { this.headers[k] = v; }, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res);
  return { ...res, dbCalls };
}
test('signed Auth0 admin can access session and content', async () => {
  const jwt = await token();
  const session = await request(jwt);
  assert.equal(session.statusCode, 200);
  assert.equal(session.body.sub, 'auth0|approved-admin');
  assert.equal(session.dbCalls, 0);
  const content = await request(jwt, 'images');
  assert.equal(content.statusCode, 200);
  assert.equal(content.dbCalls, 1);
});
test('missing, malformed and legacy shared tokens are rejected before database access', async () => {
  for (const bearer of [undefined, 'legacy-shared-token-with-32-characters', 'invalid.jwt.value']) {
    const result = await request(bearer, 'images');
    assert.equal(result.statusCode, 401);
    assert.equal(result.dbCalls, 0);
    assert.equal(result.headers['WWW-Authenticate'], 'Bearer');
  }
});
test('new signups and self-assigned metadata cannot edit content', async () => {
  for (const claims of [
    { permissions: [] },
    { permissions: undefined, scope: 'manage:content' },
    { permissions: ['read:content'], user_metadata: { role: 'admin', permissions: ['manage:content'] } },
    { permissions: 'manage:content' },
    { sub: 'machine@clients' },
  ]) {
    const jwt = await token({ claims });
    for (const [method, path, body] of [['GET', 'session'], ['GET', 'images'], ['POST', 'images', { data: {} }], ['PUT', 'images/ce1dccaf-029d-49f8-b439-bc47e80c045b', { data: {}, version: 1 }], ['DELETE', 'images/ce1dccaf-029d-49f8-b439-bc47e80c045b', { version: 1 }]]) {
      const response = await request(jwt, path, method, body);
      assert.equal(response.statusCode, 403);
      assert.equal(response.dbCalls, 0);
    }
  }
});
test('expired tokens, wrong issuer/audience and forged signatures are rejected', async () => {
  const other = await generateKeyPair('RS256');
  for (const options of [{ exp: '-1m' }, { iss: 'https://attacker.example/' }, { aud: 'spa-client-id' }, { key: other.privateKey }]) {
    const response = await request(await token(options), 'images');
    assert.equal(response.statusCode, 401);
    assert.equal(response.dbCalls, 0);
  }
  const hsToken = await token({ algorithm: 'HS256', key: new TextEncoder().encode('untrusted-key') });
  assert.equal((await request(hsToken)).statusCode, 401);
});
test('unconfigured authentication fails closed', async () => {
  for (const env of [{}, { AUTH0_DOMAIN: 'https://tenant.auth0.com/invalid-path', AUTH0_AUDIENCE: audience }]) {
    const check = createAdminAuthenticator({ env });
    await assert.rejects(check({ headers: {} }), error => error.status === 503);
  }
});
