export class AuthError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// Safe default for adapters that have not supplied a server-verified session.
export async function authenticateAdmin() {
  throw new AuthError(503, 'Neon Auth is not configured.');
}

export function neonAuthSettings(env = process.env) {
  const baseUrl = env.NEON_AUTH_BASE_URL || env.VITE_NEON_AUTH_URL;
  if (!baseUrl) throw new AuthError(503, 'Configure NEON_AUTH_BASE_URL in the server environment.');
  let url;
  try { url = new URL(baseUrl); } catch { throw new AuthError(503, 'NEON_AUTH_BASE_URL must be an HTTPS URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new AuthError(503, 'NEON_AUTH_BASE_URL must be an HTTPS URL.');
  const secret = env.NEON_AUTH_COOKIE_SECRET;
  if (!secret || secret.length < 32) throw new AuthError(503, 'Configure NEON_AUTH_COOKIE_SECRET with at least 32 random characters.');
  return { baseUrl: url.href.replace(/\/$/, ''), cookies: { secret } };
}

// The session comes only from the SDK's server-side getSession(), never headers
// containing browser-supplied user IDs, roles, email addresses or bearer claims.
export function sessionIdentity(session) {
  const { user, session: current } = session || {};
  if (!user || typeof user.id !== 'string' || !user.id || !current || current.userId !== user.id ||
      !Number.isFinite(new Date(current.expiresAt).getTime()) || new Date(current.expiresAt).getTime() <= Date.now()) {
    throw new AuthError(401, 'Sign in to access the admin API.');
  }
  return { sub: user.id, user: { sub: user.id, name: user.name, email: user.email } };
}

export function createSessionAuthenticator({ env = process.env, getDatabase }) {
  return async function authorize(req) {
    const identity = sessionIdentity(req.authSession);
    const roles = typeof req.authSession.user.role === 'string' ? req.authSession.user.role.split(',').map(role => role.trim()) : [];
    const approvedIds = (env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
    if (identity.sub === env.ADMIN_PROJECT_OWNER_SUB || approvedIds.includes(identity.sub) || roles.includes('admin')) return identity;
    const sql = getDatabase();
    const memberships = await sql`SELECT project_id FROM admin_project_members WHERE auth0_sub = ${identity.sub} LIMIT 1`;
    if (!memberships.length) throw new AuthError(403, 'Your account is awaiting content access. Ask the website owner to add you to a project.');
    return identity;
  };
}
