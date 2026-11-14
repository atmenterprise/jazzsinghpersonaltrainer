import { createHandler } from './handler.js';
import { database } from './db.js';
import { adminOrigin, requireSameOrigin } from './session-auth.js';
import { AuthError, createSessionAuthenticator, sessionIdentity } from './auth.js';
const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export function createNextAdminApi({ env = process.env, getSession, getDatabase = database }) {
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
          return json(200, { configured: true, authenticated: true, approved: true, user: identity.user });
        } catch (error) {
          if (error.status !== 403) throw error;
          return json(200, { configured: true, authenticated: true, approved: false, user: identity.user, error: error.message });
        }
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
