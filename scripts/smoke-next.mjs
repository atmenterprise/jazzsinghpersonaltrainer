import assert from 'node:assert/strict';
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
for (const path of ['/', '/booking', '/onetoonept', '/couplept', '/onlinept', '/nutritionpt', '/testimonials', '/faq', '/privacy', '/disclaimer']) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('set-cookie'), null, `${path}: public pages must not start an admin session`);
  const html = await response.text();
  assert.ok(html.includes('Jaz BooM Personal Training'), path);
  assert.ok(html.includes('/assets/'), `${path}: public bundle`);
  if (path === '/') {
    const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)[1];
    assert.equal((await fetch(`${base}${asset}`)).status, 200, asset);
  }
  console.log(`PASS public ${path}`);
}
for (const path of ['/css/main.css', '/css/modern.css', '/img/header-jaz-training.jpg', '/admin/atm-logo.svg']) {
  assert.equal((await fetch(`${base}${path}`)).status, 200, path);
  console.log(`PASS asset ${path}`);
}
const admin = await fetch(`${base}/admin`);
assert.equal(admin.status, 200);
assert.ok((await admin.text()).includes('ATM CONTENT STUDIO'));
console.log('PASS Next.js /admin');
const status = await fetch(`${base}/api/admin/auth/status`);
assert.ok([200, 503].includes(status.status));
assert.ok(status.headers.get('content-type').includes('application/json'));
const data = await status.json();
if (status.status === 200) assert.deepEqual(data, { configured: true, authenticated: false });
else assert.equal(typeof data.error, 'string');
console.log(`PASS session JSON (${status.status})`);
const protectedApi = await fetch(`${base}/api/admin/projects`);
assert.ok([401, 503].includes(protectedApi.status));
assert.ok(protectedApi.headers.get('content-type').includes('application/json'));
console.log(`PASS protected API (${protectedApi.status})`);

for (const path of ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email']) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes('ATM CONTENT STUDIO'), path);
  assert.ok(!html.includes('Sign in with Auth0'), path);
  console.log(`PASS auth page ${path}`);
}
const crossSite = await fetch(`${base}/api/admin/projects`, { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: '{}' });
assert.equal(crossSite.status, 403);
console.log('PASS cross-site write rejection');
const forged = await fetch(`${base}/api/admin/projects`, { headers: { cookie: '__Secure-neon-auth.session_token=forged; neon-auth.session_token=forged' } });
assert.ok([401, 503].includes(forged.status));
console.log(`PASS invalid session denial (${forged.status})`);
