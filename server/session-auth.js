import { AuthError } from './auth.js';

// Vercel hosts come from trusted system variables, never arbitrary forwarded headers.
export function adminOrigin(req, env = process.env) {
  const explicit = env.APP_BASE_URL;
  if (explicit) {
    const url = new URL(explicit);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new AuthError(503, 'Configure a valid admin application origin.');
    return url.origin;
  }
  const hosts = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean);
  if (env.VERCEL || hosts.length) {
    const host = req.headers.host;
    if (!hosts.includes(host)) throw new AuthError(503, 'This admin hostname is not configured. Set APP_BASE_URL to its HTTPS origin.');
    return `https://${host}`;
  }
  return 'http://localhost:3000';
}

export function requireSameOrigin(req, origin) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin !== origin) {
    throw new AuthError(403, 'This request must originate from the admin website.');
  }
}
