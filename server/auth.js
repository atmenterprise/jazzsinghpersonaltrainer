import { createRemoteJWKSet, jwtVerify } from 'jose';

export class AuthError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// A fresh verifier can accept a local JWKS resolver in tests. Production always
// resolves keys from the configured issuer, never from an untrusted token URL.
export function createAdminAuthenticator({ env = process.env, resolveKey } = {}) {
  let cachedIssuer;
  let remoteKeys;
  return async function authenticate(req) {
    const domain = env.AUTH0_DOMAIN;
    const audience = env.AUTH0_AUDIENCE;
    if (!domain || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(domain) || !audience) {
      throw new AuthError(503, 'Admin authentication is not configured. Set AUTH0_DOMAIN and AUTH0_AUDIENCE on the server.');
    }
    const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || '');
    if (!match) throw new AuthError(401, 'Sign in to access the admin API.');
    const issuer = `https://${domain}/`;
    if (!resolveKey && cachedIssuer !== issuer) {
      remoteKeys = createRemoteJWKSet(new URL('.well-known/jwks.json', issuer), { timeoutDuration: 5000 });
      cachedIssuer = issuer;
    }
    let payload;
    try {
      ({ payload } = await jwtVerify(match[1], resolveKey || remoteKeys, {
        issuer, audience, algorithms: ['RS256'], requiredClaims: ['sub', 'iat', 'exp'],
      }));
    } catch {
      throw new AuthError(401, 'Your session is invalid or expired. Please sign in again.');
    }
    // Auth0 RBAC permissions are server-issued. User metadata and ID tokens are
    // never accepted as authorization. New signups have no permissions by default.
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.endsWith('@clients') ||
        !Array.isArray(payload.permissions) || !payload.permissions.includes('manage:content')) {
      throw new AuthError(403, 'Your account is awaiting admin approval. Ask the website owner to grant content access.');
    }
    return { sub: payload.sub };
  };
}
export const authenticateAdmin = createAdminAuthenticator();
