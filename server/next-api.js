import { createHandler } from './handler.js';
import { database } from './db.js';
import { adminOrigin, requireSameOrigin } from './session-auth.js';
import { AuthError, createSessionAuthenticator, sessionIdentity, isAccessAdmin } from './auth.js';
import { recordAccessRequest, notifyAccessRequest, listAccessRequests, approveAccessRequest, denyAccessRequest, notifyAccessDecision } from './access-requests.js';
import { sendSignupMail, sendDecisionMail } from './signup-mail.js';
const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export function createNextAdminApi({ env = process.env, getSession, getDatabase = database, sendMail = sendSignupMail, sendDecision = sendDecisionMail }) {
  const authorize = createSessionAuthenticator({ env, getDatabase });
  return async function route(request) {
    try {
      const headers = Object.fromEntries(request.headers);
      // Next's request host is checked against configured origins for cookie writes.
      const req = { method: request.method, url: request.url, headers, body: undefined };
      requireSameOrigin(req, adminOrigin(req, env));
      if (!getSession) throw new AuthError(503, 'Neon Auth is not configured.');
      const result = await getSession(request);
      if (result?.error) throw new AuthError(503, 'Unable to verify your Neon Auth session. Please try again.');
      req.authSession = result?.data;
      if (request.method === 'GET' && new URL(request.url).pathname === '/api/admin/auth/status') {
        if (!req.authSession) return json(200, { configured: true, authenticated: false });
        const identity = sessionIdentity(req.authSession);
        try {
          await authorize(req);
          return json(200, { configured: true, authenticated: true, approved: true, accessAdmin: isAccessAdmin(req.authSession, env), user: identity.user });
        } catch (error) {
          if (error.status !== 403) throw error;
          const [accessRequest] = await getDatabase()`SELECT denied_at FROM admin_access_requests WHERE user_id = ${identity.sub}`;
          return json(200, { configured: true, authenticated: true, approved: false, user: identity.user, error: accessRequest?.denied_at ? 'Your access request was denied. Contact atmenterprise23@gmail.com if you need assistance.' : error.message });
        }
      }
      const path = new URL(request.url).pathname;
      if (path === '/api/admin/access-requests' || path.startsWith('/api/admin/access-requests/')) {
        const identity = sessionIdentity(req.authSession);
        const selfRequest = path === '/api/admin/access-requests/register' && request.method === 'POST';
        if (!selfRequest && !isAccessAdmin(req.authSession, env)) throw new AuthError(403, 'Only administrators can manage access requests.');
        if (selfRequest) {
          const sql = getDatabase();
          const row = await recordAccessRequest(sql, req.authSession.user);
          await notifyAccessRequest(sql, row, env, sendMail);
          return json(200, { requested: true, requestStatus: row.denied_at ? 'denied' : row.approved_at ? 'approved' : 'pending' });
        }
        if (path === '/api/admin/access-requests' && request.method === 'GET') {
          const sql = getDatabase();
          return json(200, { requests: await listAccessRequests(sql), projects: await sql`SELECT id, name FROM admin_projects ORDER BY name, id` });
        }
        if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });
        if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, { error: 'Use application/json.' });
        let raw = ''; let size = 0;
        if (request.body) for await (const chunk of request.body) {
          size += chunk.byteLength;
          if (size > 10000) return json(413, { error: 'Request too large.' });
          raw += new TextDecoder().decode(chunk);
        }
        let body;
        try { body = JSON.parse(raw); } catch { return json(400, { error: 'Invalid JSON body.' }); }
        if (!body || typeof body.userId !== 'string' || !body.userId || body.userId.length > 200) return json(400, { error: 'Select a valid request.' });
        const sql = getDatabase();
        if (['/api/admin/access-requests/approve', '/api/admin/access-requests/deny'].includes(path)) {
          const approval = path.endsWith('/approve');
          const row = approval
            ? await approveAccessRequest(sql, body.userId, body.projectId, identity.sub)
            : await denyAccessRequest(sql, body.userId, identity.sub);
          const failed = await notifyAccessDecision(sql, row, env, sendDecision);
          return json(200, { ...row, message: `${approval ? 'Access approved. The user can now open the selected project.' : 'Access request denied.'} ${failed.length ? 'The notification email could not be sent. An administrator can retry delivery after five minutes.' : 'Notification delivery processed; check the email status below.'}` });
        }
        if (path === '/api/admin/access-requests/retry-decision') {
          const [row] = await sql`SELECT * FROM admin_access_requests WHERE user_id = ${body.userId}`;
          if (!row) return json(404, { error: 'Request not found.' });
          const failed = await notifyAccessDecision(sql, row, env, sendDecision);
          return json(200, { message: failed.length ? 'Email delivery failed. Check Gmail settings and retry after five minutes.' : 'Delivery checked. Sent emails are skipped; active attempts can be retried after five minutes.' });
        }
        if (path === '/api/admin/access-requests/retry') {
          const [row] = await sql`SELECT * FROM admin_access_requests WHERE user_id = ${body.userId}`;
          if (!row) return json(404, { error: 'Request not found.' });
          const failed = await notifyAccessRequest(sql, row, env, sendMail);
          return json(200, { message: failed.length ? 'Email delivery failed. Check Gmail settings and retry after five minutes.' : 'Delivery checked. Sent emails are skipped; active attempts can be retried after five minutes.' });
        }
        return json(404, { error: 'Endpoint not found.' });
      }
      // Authenticate before accepting request bodies or accessing the database.
      const identity = await authorize(req);
      // Limit streaming bodies before parsing, including malformed/oversized JSON.
      if (request.body) {
        let size = 0; const chunks = [];
        for await (const chunk of request.body) {
          size += chunk.byteLength;
          if (size > 100000) return json(413, { error: 'Record too large.' });
          chunks.push(chunk);
        }
        req.body = Buffer.concat(chunks).toString('utf8');
      }
      let response;
      const resultHeaders = new Headers();
      const res = { statusCode: 200, setHeader: (key, value) => resultHeaders.set(key, value), end: value => { response = new Response(value, { status: res.statusCode, headers: resultHeaders }); } };
      await createHandler(getDatabase, async () => identity)(req, res);
      return response || json(500, { error: 'Unable to process this request.' });
    } catch (error) {
      return json(error.status || 503, { error: error.status ? error.message : 'Admin authentication service unavailable. Check Vercel function logs.' });
    }
  };
}
