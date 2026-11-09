import { AuthError, authenticateAdmin } from './auth.js';

export const permissionClaim = 'https://atmenterprise.github.io/atm/permissions';
export function sessionSettings(env = process.env) {
  const required = ['AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_DOMAIN', 'AUTH0_SECRET'];
  const missing = required.filter(key => !env[key]?.trim());
  if (missing.length) throw new AuthError(503, `Admin setup needed. Configure ${missing.join(', ')} in the server environment.`);
  if (env.AUTH0_SECRET.length < 32) throw new AuthError(503, 'AUTH0_SECRET must contain at least 32 characters.');
  let issuer;
  try { issuer = new URL(env.AUTH0_DOMAIN.startsWith('https://') ? env.AUTH0_DOMAIN : `https://${env.AUTH0_DOMAIN}`); } catch { throw new AuthError(503, 'AUTH0_DOMAIN must be an Auth0 hostname or HTTPS origin.'); }
  if (issuer.protocol !== 'https:' || issuer.username || issuer.password || issuer.pathname !== '/' || issuer.search || issuer.hash) throw new AuthError(503, 'AUTH0_DOMAIN must be an Auth0 hostname or HTTPS origin.');
  return { issuer: issuer.origin, clientID: env.AUTH0_CLIENT_ID, clientSecret: env.AUTH0_CLIENT_SECRET, secret: env.AUTH0_SECRET };
}

// Vercel hosts come from trusted system variables, never arbitrary forwarded headers.
export function adminOrigin(req, env = process.env) {
  const explicit = env.AUTH0_BASE_URL || env.APP_BASE_URL;
  if (explicit) {
    const url = new URL(explicit);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new AuthError(503, 'Configure a valid Auth0 application origin.');
    return url.origin;
  }
  const hosts = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean);
  if (env.VERCEL || hosts.length) {
    const host = req.headers.host;
    if (!hosts.includes(host)) throw new AuthError(503, 'This admin hostname is not configured. Set AUTH0_BASE_URL to its HTTPS origin.');
    return `https://${host}`;
  }
  return 'http://localhost:5173';
}

export function requireSameOrigin(req, origin) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin !== origin) {
    throw new AuthError(403, 'This request must originate from the admin website.');
  }
}

export function createSessionAuthenticator({ env = process.env, fetchImpl = fetch, verifyAccessToken = authenticateAdmin } = {}) {
  let managementToken;
  let tokenExpires = 0;
  async function managementPermissions(subject, issuer) {
    if (!managementToken || Date.now() >= tokenExpires) {
      const response = await fetchImpl(`${issuer}/oauth/token`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ grant_type: 'client_credentials', client_id: env.AUTH0_MANAGEMENT_API_CLIENT_ID, client_secret: env.AUTH0_MANAGEMENT_API_CLIENT_SECRET, audience: `${issuer}/api/v2/` }),
      });
      if (!response.ok) throw new AuthError(503, 'Unable to check admin permissions. Check the Management API credentials and read:users grant.');
      const result = await response.json();
      if (typeof result.access_token !== 'string' || !Number.isFinite(result.expires_in) || result.expires_in <= 0) throw new AuthError(503, 'Invalid Management API response.');
      managementToken = result.access_token;
      tokenExpires = Date.now() + Math.max(0, result.expires_in - 60) * 1000;
    }
    for (let page = 0; page < 100; page++) {
      const response = await fetchImpl(`${issuer}/api/v2/users/${encodeURIComponent(subject)}/permissions?per_page=100&page=${page}`, {
        headers: { Authorization: `Bearer ${managementToken}` }, signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        if (response.status === 401) { managementToken = undefined; tokenExpires = 0; }
        throw new AuthError(503, 'Unable to check admin permissions. Grant read:users to the Management API application.');
      }
      const permissions = await response.json();
      if (!Array.isArray(permissions)) throw new AuthError(503, 'Invalid Management API permission response.');
      if (permissions.some(p => p.permission_name === 'manage:content' && p.resource_server_identifier === (env.AUTH0_AUDIENCE || 'https://atm-content-studio-api'))) return true;
      if (permissions.length < 100) return false;
    }
    throw new AuthError(503, 'Unable to finish checking admin permissions.');
  }
  return async function authenticate(req) {
    // Existing explicit bearer clients remain supported when an API audience is configured.
    if (req.headers.authorization) return verifyAccessToken(req);
    if (!req.oidc?.isAuthenticated()) throw new AuthError(401, 'Sign in to access the admin API.');
    const user = req.oidc.user;
    if (!user?.sub || typeof user.sub !== 'string' || user.sub.endsWith('@clients')) throw new AuthError(401, 'Invalid user session.');
    const identity = { sub: user.sub, user: { sub: user.sub, name: user.name, email: user.email } };
    // This claim is set in an Auth0 Post Login Action, never user_metadata.
    if (Array.isArray(user[permissionClaim]) && user[permissionClaim].includes('manage:content')) return identity;
    if (env.AUTH0_AUDIENCE && req.oidc.accessToken?.access_token) {
      let token = req.oidc.accessToken;
      if (token.isExpired()) {
        try { token = await token.refresh(); }
        catch { throw new AuthError(401, 'Your session has expired. Please sign in again.'); }
      }
      const verified = await verifyAccessToken({ headers: { authorization: `Bearer ${token.access_token}` } });
      if (verified.sub !== user.sub) throw new AuthError(401, 'Invalid user session.');
      return identity;
    }
    if (env.AUTH0_MANAGEMENT_API_CLIENT_ID && env.AUTH0_MANAGEMENT_API_CLIENT_SECRET) {
      try { if (await managementPermissions(user.sub, sessionSettings(env).issuer)) return identity; }
      catch (error) { if (error instanceof AuthError) throw error; throw new AuthError(503, 'Admin permission service unavailable. Please try again.'); }
    }
    throw new AuthError(403, 'Your account is awaiting admin approval. Ask the website owner to grant content access.');
  };
}
