import test from 'node:test';
import assert from 'node:assert/strict';
import { createNextAdminApi } from '../server/next-api.js';
import { captureSignupNotifications } from '../server/signup-notifications.js';
import { sendSignupMail, sendDecisionMail } from '../server/signup-mail.js';
import { isAccessAdmin } from '../server/auth.js';
import { recordAccessRequest, notifyAccessRequest, approveAccessRequest, denyAccessRequest, notifyAccessDecision } from '../server/access-requests.js';
const user = { id: 'new-user', email: 'new@example.com', name: 'New User' };
const session = (role) => ({ user: { ...user, role }, session: { userId: user.id, expiresAt: new Date(Date.now() + 60000).toISOString() } });
const request = (path = '', body, origin = 'http://localhost:3000') => new Request(`http://localhost:3000/api/admin/access-requests${path}`, body === undefined ? {} : { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
test('members and client roles cannot manage approvals; designated admins can', async () => {
  let queries = 0;
  const getDatabase = () => async () => { queries++; return []; };
  const member = createNextAdminApi({ env: {}, getSession: async () => ({ data: session() }), getDatabase });
  assert.equal((await member(request())).status, 403);
  assert.equal((await member(request('/approve', { userId: 'target', projectId: 'jazboom', role: 'admin' }))).status, 403);
  assert.equal((await member(request('/retry', { userId: 'target' }))).status, 403);
  assert.equal(queries, 0);
  for (const env of [{ ADMIN_USER_IDS: user.id }, { ADMIN_PROJECT_OWNER_SUB: user.id }]) {
    assert.equal(isAccessAdmin(session(), env), true);
    const route = createNextAdminApi({ env, getSession: async () => ({ data: session() }), getDatabase });
    assert.equal((await route(request())).status, 200);
  }
  assert.equal(isAccessAdmin(session('admin'), {}), true);
  assert.equal(isAccessAdmin(session('editor'), {}), false);
});
test('approvals reject anonymous and cross-origin requests before accessing DB', async () => {
  const getDatabase = () => { throw new Error('Unexpected DB access'); };
  const anonymous = createNextAdminApi({ env: {}, getSession: async () => ({ data: null }), getDatabase });
  assert.equal((await anonymous(request('/approve', {}))).status, 401);
  const admin = createNextAdminApi({ env: { ADMIN_USER_IDS: user.id }, getSession: async () => ({ data: session() }), getDatabase });
  assert.equal((await admin(request('/approve', {}, 'https://evil.example'))).status, 403);
  const validation = createNextAdminApi({ env: { ADMIN_USER_IDS: user.id }, getSession: async () => ({ data: session() }), getDatabase: () => async () => [] });
  assert.equal((await validation(request('/approve', { userId: 'target', projectId: 'invalid project' }))).status, 400);
});
test('self registration uses server session identity, ignoring submitted account and project', async () => {
  const queries = []; const delivered = [];
  const row = { user_id: user.id, name: user.name, email: user.email };
  const sql = async (strings, ...values) => {
    const text = strings.join('?'); queries.push({ text, values });
    if (text.includes('INSERT INTO admin_access_requests')) return [row];
    if (text.includes('INSERT INTO admin_access_notifications')) return [{ user_id: user.id }];
    return [];
  };
  const route = createNextAdminApi({ env: {}, getSession: async () => ({ data: session() }), getDatabase: () => sql, sendMail: async (...args) => delivered.push(args) });
  assert.equal((await route(request('/register', { userId: 'victim', email: 'victim@example.com', projectId: 'private' }))).status, 200);
  assert.deepEqual(queries[0].values, [user.id, user.email, user.name]);
  assert.equal(delivered.length, 2);
  assert.deepEqual(delivered.map(args => args[1]).sort(), ['applicant', 'owner']);
  assert.ok(queries.every(query => !query.text.includes('INSERT INTO admin_project_members')));
});
test('notification claims skip delivered messages and retain failed deliveries for retry', async () => {
  const row = { user_id: user.id, email: user.email };
  let sends = 0; let updates = 0;
  const claimed = new Set();
  const sql = async (strings, ...values) => {
    if (strings.join('').includes('INSERT INTO')) { if (claimed.has(values[1])) return []; claimed.add(values[1]); return [row]; }
    updates++; return [];
  };
  const send = async (_row, kind) => { sends++; if (kind === 'owner') throw new Error('private SMTP password'); };
  assert.deepEqual(await notifyAccessRequest(sql, row, {}, send), ['owner']);
  assert.equal(updates, 1);
  await notifyAccessRequest(sql, row, {}, send);
  assert.equal(sends, 2);
});
test('approval validates project IDs, binds SQL values, and rejects missing or already approved requests', async () => {
  await assert.rejects(approveAccessRequest(() => { throw new Error('No SQL expected'); }, user.id, 'bad project', 'admin'), { status: 400 });
  let query;
  const sql = async (strings, ...values) => { query = { text: strings.join('?'), values }; return []; };
  await assert.rejects(approveAccessRequest(sql, user.id, 'jazboom', 'admin'), { status: 409 });
  assert.match(query.text, /FOR UPDATE/);
  assert.match(query.text, /INSERT INTO admin_project_members/);
  assert.match(query.text, /ON CONFLICT DO NOTHING/);
  assert.match(query.text, /approved_by/);
  assert.ok(query.values.includes(user.id));
  assert.ok(query.values.includes('jazboom'));
  assert.ok(!query.text.includes(user.id));
});
test('invalid upstream identities cannot produce access requests', async () => {
  await assert.rejects(recordAccessRequest(() => { throw new Error('No SQL expected'); }, { id: user.id, email: 'bad\r\nBcc: victim@example.com' }));
});

test('Gmail sends separate messages to the owner and applicant using TLS and app credentials', async () => {
  const messages = []; const options = [];
  const env = { GMAIL_SMTP_USER: 'sender@gmail.com', GMAIL_SMTP_APP_PASSWORD: 'abcd efgh ijkl mnop', APP_BASE_URL: 'https://studio.example.com' };
  const createTransport = config => { options.push(config); return { sendMail: async message => { messages.push(message); return { accepted: [message.to.address] }; } }; };
  const row = { user_id: user.id, name: user.name, email: user.email };
  for (const kind of ['owner', 'applicant']) await sendSignupMail(row, kind, env, createTransport);
  assert.equal(options[0].host, 'smtp.gmail.com');
  assert.equal(options[0].port, 465);
  assert.equal(options[0].secure, true);
  assert.equal(options[0].auth.pass, 'abcdefghijklmnop');
  assert.equal(messages[0].to.address, 'atmenterprise23@gmail.com');
  assert.equal(messages[1].to.address, user.email);
  assert.match(messages[0].text, /new-user/);
  assert.match(messages[1].text, /administrator/);
  assert.doesNotMatch(JSON.stringify(messages), /abcdefghijklmnop/);
  for (const message of messages) {
    assert.equal(message.from.name, 'ATM Content Studio');
    assert.match(message.html, /<html lang="en">/);
    assert.match(message.html, /https:\/\/studio\.example\.com\/admin/);
    assert.doesNotMatch(message.text + message.html + message.subject, /neon|vercel/i);
  }
  await sendSignupMail({ ...row, name: '<img src=x onerror=alert(1)>' }, 'applicant', env, createTransport);
  assert.match(messages[2].html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(messages[2].html, /<img src=x/);
  await assert.rejects(sendSignupMail(row, 'owner', {}, createTransport), /Configure Gmail/);
});

test('successful verification-required signup records and emails the upstream user without consuming the response', async () => {
  const calls = []; const mails = [];
  const row = { user_id: user.id, name: user.name, email: user.email };
  const sql = async (strings, ...values) => { calls.push(values); return strings.join('').includes('INSERT') ? [row] : []; };
  const response = Response.json({ token: null, user });
  const req = new Request('http://localhost:3000/api/auth/sign-up/email', { method: 'POST', body: JSON.stringify({ id: 'forged-user', email: 'forged@example.com' }) });
  await captureSignupNotifications(req, 'sign-up/email', response, () => sql, async (_row, kind) => mails.push(kind));
  assert.deepEqual(calls[0], [user.id, user.email, user.name]);
  assert.equal(mails.length, 2);
  assert.deepEqual(await response.json(), { token: null, user });
  for (const [path, status] of [['sign-in/email', 200], ['sign-up/email', 400]]) {
    await captureSignupNotifications(req, path, Response.json({ user }, { status }), () => { throw new Error('Must not access database'); });
  }
});

test('approval and denial emails preserve the HTML design, accurate status, and corrected branding', async () => {
  const messages = [];
  const env = { GMAIL_SMTP_USER: 'sender@gmail.com', GMAIL_SMTP_APP_PASSWORD: 'test', APP_BASE_URL: 'https://studio.example.com' };
  const transport = () => ({ sendMail: async message => { messages.push(message); return { accepted: [message.to.address] }; } });
  const row = { user_id: user.id, email: user.email, name: '<Admin & User>', project_id: 'jazboom' };
  await sendDecisionMail(row, 'approved', env, transport);
  await sendDecisionMail(row, 'denied', env, transport);
  for (const message of messages) {
    assert.equal(message.to.address, user.email);
    assert.equal(message.from.name, 'ATM Content Studio');
    assert.match(message.html, /background-color:#14213d/);
    assert.match(message.html, /&lt;Admin &amp; User&gt;/);
    assert.doesNotMatch(message.text + message.html + message.subject, /Studion|neon|vercel/i);
  }
  assert.match(messages[0].text, /account is approved/);
  assert.match(messages[0].html, /jazboom/);
  assert.match(messages[0].html, /https:\/\/studio\.example\.com\/admin/);
  assert.match(messages[1].text, /request was denied/);
  assert.match(messages[1].html, /mailto:atmenterprise23@gmail.com/);
  assert.doesNotMatch(messages[1].html, /jazboom|ACCESS PENDING/);
});

test('only admins can deny requests, and denial never writes project memberships', async () => {
  let query;
  const sql = async (strings, ...values) => { query = { text: strings.join('?'), values }; return [{ user_id: user.id, denied_at: new Date().toISOString() }]; };
  await denyAccessRequest(sql, user.id, 'owner');
  assert.match(query.text, /approved_at IS NULL AND denied_at IS NULL/);
  assert.match(query.text, /denied_by/);
  assert.doesNotMatch(query.text, /admin_project_members/);
  assert.deepEqual(query.values, ['owner', user.id]);
  await assert.rejects(denyAccessRequest(async () => [], user.id, 'owner'), { status: 409 });
  const route = createNextAdminApi({ env: {}, getSession: async () => ({ data: session() }), getDatabase: () => { throw new Error('No database expected'); } });
  assert.equal((await route(request('/deny', { userId: user.id }))).status, 403);
  assert.equal((await route(request('/retry-decision', { userId: user.id }))).status, 403);
});

test('admin decisions send the matching user email and preserve the decision when SMTP fails', async () => {
  for (const action of ['approve', 'deny']) {
    const sent = []; const queries = [];
    const row = { user_id: user.id, email: user.email, name: user.name, project_id: action === 'approve' ? 'jazboom' : null, [action === 'approve' ? 'approved_at' : 'denied_at']: new Date().toISOString() };
    const sql = async (strings, ...values) => {
      const text = strings.join('?'); queries.push({ text, values });
      if (text.includes('WITH eligible') || text.includes('SET denied_at')) return [row];
      if (text.includes('INSERT INTO admin_access_notifications')) return [{ user_id: user.id }];
      return [];
    };
    const route = createNextAdminApi({ env: { ADMIN_USER_IDS: user.id }, getSession: async () => ({ data: session() }), getDatabase: () => sql, sendDecision: async (account, kind) => { sent.push({ account, kind }); throw new Error('secret-smtp-password'); } });
    const response = await route(request(`/${action}`, { userId: user.id, projectId: 'jazboom' }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.match(result.message, /notification email could not be sent/);
    assert.doesNotMatch(result.message, /secret-smtp-password/);
    assert.equal(sent[0].kind, action === 'approve' ? 'approved' : 'denied');
    assert.equal(sent[0].account.email, user.email);
    if (action === 'approve') assert.match(queries[0].text, /denied_at IS NULL/);
  }
});

test('decision email retries use the stored decision, skip claimed/sent mail, and cannot reopen denied requests', async () => {
  const row = { user_id: user.id, email: user.email, denied_at: new Date().toISOString() };
  let sends = 0;
  const sent = async () => { sends++; };
  assert.deepEqual(await notifyAccessDecision(async () => [], row, {}, sent), []);
  assert.equal(sends, 0);
  assert.deepEqual(await notifyAccessRequest(() => { throw new Error('No signup email expected'); }, row, {}, sent), []);
  await assert.rejects(notifyAccessDecision(async () => [], { user_id: user.id }), { status: 400 });
  let called = 0;
  const route = createNextAdminApi({ env: { ADMIN_USER_IDS: user.id }, getSession: async () => ({ data: session() }), getDatabase: () => async (strings) => strings.join('').includes('SELECT *') ? [row] : [{ user_id: user.id }], sendDecision: async (_row, kind) => { assert.equal(kind, 'denied'); called++; } });
  assert.equal((await route(request('/retry-decision', { userId: user.id, kind: 'approved' }))).status, 200);
  assert.equal(called, 1);
});
