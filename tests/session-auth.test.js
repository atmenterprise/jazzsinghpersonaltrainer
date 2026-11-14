import test from 'node:test';
import assert from 'node:assert/strict';
import { adminOrigin, requireSameOrigin } from '../server/session-auth.js';
test('custom origins are validated', () => {
  assert.equal(adminOrigin({ headers: {} }, { APP_BASE_URL: 'https://studio.example' }), 'https://studio.example');
  assert.throws(() => adminOrigin({ headers: {} }, { APP_BASE_URL: 'https://attacker@studio.example/path' }));
});
test('writes must originate from the admin site', () => {
  assert.throws(() => requireSameOrigin({ method: 'POST', headers: { origin: 'https://evil.example' } }, 'https://studio.example'), error => error.status === 403);
  requireSameOrigin({ method: 'POST', headers: { origin: 'https://studio.example' } }, 'https://studio.example');
});
