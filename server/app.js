import express from 'express';
import openid from 'express-openid-connect';
import { createHandler } from './handler.js';
import { database } from './db.js';
import { adminOrigin, sessionSettings, requireSameOrigin, createSessionAuthenticator } from './session-auth.js';

export function createApp({ env = process.env, authMiddleware = openid.auth, authenticate = createSessionAuthenticator({ env }), getDatabase = database } = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (env.VERCEL) app.set('trust proxy', 1);
  const middleware = new Map();
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/admin/')) return res.status(404).json({ error: 'Endpoint not found.' });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      const settings = sessionSettings(env);
      const baseURL = adminOrigin(req, env);
      requireSameOrigin(req, baseURL);
      if (!middleware.has(baseURL)) middleware.set(baseURL, authMiddleware({
        authRequired: false, auth0Logout: true, secret: settings.secret,
        baseURL, clientID: settings.clientID, clientSecret: settings.clientSecret, issuerBaseURL: settings.issuer,
        authorizationParams: { response_type: 'code', response_mode: 'query', scope: 'openid profile email', ...(env.AUTH0_AUDIENCE ? { audience: env.AUTH0_AUDIENCE } : {}) },
        routes: { login: false, logout: false, callback: '/api/admin/auth/callback' },
        session: { name: 'atm_session', rolling: false, absoluteDuration: 8 * 60 * 60, cookie: { httpOnly: true, secure: baseURL.startsWith('https:'), sameSite: 'Lax', path: '/api/admin' } },
      }));
      req.adminOrigin = baseURL;
      middleware.get(baseURL)(req, res, next);
    } catch (error) {
      res.status(error.status || 503).json({ configured: false, error: error.status ? error.message : 'Admin authentication configuration is invalid.' });
    }
  });
  app.get('/api/admin/auth/login', (req, res) => res.oidc.login({ returnTo: '/admin', authorizationParams: { screen_hint: req.query.screen_hint === 'signup' ? 'signup' : 'login' } }));
  app.post('/api/admin/auth/logout', (req, res) => res.oidc.logout({ returnTo: `${req.adminOrigin}/admin` }));
  app.get('/api/admin/auth/status', async (req, res) => {
    if (!req.oidc.isAuthenticated()) return res.json({ configured: true, authenticated: false });
    const { sub, name, email } = req.oidc.user;
    try { await authenticate(req); res.json({ configured: true, authenticated: true, approved: true, user: { sub, name, email } }); }
    catch (error) { res.json({ configured: true, authenticated: true, approved: false, user: { sub, name, email }, error: error.status ? error.message : 'Unable to verify admin access.' }); }
  });
  app.use(createHandler(getDatabase, authenticate));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    // Do not send OAuth codes, tokens, or upstream error details to the browser.
    res.status(400).type('html').send('<!doctype html><title>ATM Content Studio</title><h1>Sign-in could not be completed</h1><p>Check the Auth0 callback URL and application settings, then try again.</p><a href="/admin">Return to ATM Content Studio</a>');
  });
  return app;
}
export default createApp();
