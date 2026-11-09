import { createHandler } from './handler.js';
import { database } from './db.js';
import { adminOrigin, sessionSettings, requireSameOrigin, createSessionAuthenticator } from './session-auth.js';
const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export function createNextAdminApi({ getSession, getAccessToken, env = process.env, authorize = createSessionAuthenticator({ env }), getDatabase = database }) {
  return async function route(request) {
    try {
      sessionSettings(env);
      const headers = Object.fromEntries(request.headers);
      // Next's request host is checked against configured origins for cookie writes.
      const req = { method: request.method, url: request.url, headers, body: undefined };
      requireSameOrigin(req, adminOrigin(req, env));
      const session = await getSession(request);
      const tokenSet = session?.tokenSet;
      req.oidc = {
        isAuthenticated: () => Boolean(session?.user), user: session?.user,
        accessToken: tokenSet?.accessToken ? {
          access_token: tokenSet.accessToken,
          isExpired: () => tokenSet.expiresAt <= Date.now() / 1000,
          refresh: async () => ({ access_token: (await getAccessToken()).token }),
        } : undefined,
      };
      if (request.method === 'GET' && new URL(request.url).pathname === '/api/admin/auth/status') {
        if (!session?.user) return json(200, { configured: true, authenticated: false });
        const { sub, name, email } = session.user;
        try { await authorize(req); return json(200, { configured: true, authenticated: true, approved: true, user: { sub, name, email } }); }
        catch (error) { return json(200, { configured: true, authenticated: true, approved: false, user: { sub, name, email }, error: error.status ? error.message : 'Unable to verify admin access.' }); }
      }
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
      await createHandler(getDatabase, authorize)(req, res);
      return response || json(500, { error: 'Unable to process this request.' });
    } catch (error) {
      return json(error.status || 503, { error: error.status ? error.message : 'Admin authentication service unavailable. Check Vercel function logs.' });
    }
  };
}
