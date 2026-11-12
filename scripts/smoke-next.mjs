import assert from 'node:assert/strict';
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
for (const path of ['/', '/booking', '/onetoonept', '/couplept', '/onlinept', '/nutritionpt', '/testimonials', '/faq', '/privacy', '/disclaimer']) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('set-cookie'), null, `${path}: public pages must not start an Auth0 session`);
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
assert.ok(data.authenticated === false || typeof data.error === 'string');
console.log(`PASS session JSON (${status.status})`);
const protectedApi = await fetch(`${base}/api/admin/projects`);
assert.ok([401, 503].includes(protectedApi.status));
assert.ok(protectedApi.headers.get('content-type').includes('application/json'));
console.log(`PASS protected API (${protectedApi.status})`);

if (status.status === 200) {
  const login = await fetch(`${base}/auth/login?returnTo=%2Fadmin`, { redirect: 'manual' });
  assert.ok([302, 307].includes(login.status), `Auth0 login initiation: ${login.status}`);
  const authorize = new URL(login.headers.get('location'));
  assert.equal(authorize.protocol, 'https:');
  assert.equal(authorize.searchParams.get('response_type'), 'code');
  assert.equal(new URL(authorize.searchParams.get('redirect_uri')).pathname, '/auth/callback');
  console.log('PASS Auth0 authorization-code redirect and /auth/callback');
  const returnTo = new URL(authorize.searchParams.get('redirect_uri')).origin + '/admin';
  const logout = await fetch(`${base}/auth/logout?returnTo=${encodeURIComponent(returnTo)}`, { redirect: 'manual' });
  assert.ok([302, 307].includes(logout.status), `Logout initiation: ${logout.status}`);
  const endSession = new URL(logout.headers.get('location'));
  assert.equal(endSession.searchParams.get('post_logout_redirect_uri') || endSession.searchParams.get('returnTo'), returnTo);
  console.log('PASS Auth0 logout redirect back to /admin');
}
