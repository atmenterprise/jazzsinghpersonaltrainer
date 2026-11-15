import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';
import { neonAuthSettings } from '../../server/auth';

// Initialize at request time so missing deployment settings yield a useful JSON
// error instead of failing the build. Secrets never enter a client bundle.
let auth: ReturnType<typeof createNeonAuth>;
export function getNeonAuth() {
  return auth ??= createNeonAuth(neonAuthSettings());
}

export function getAdminSession() {
  // Check revocation against Neon for every content API request.
  return getNeonAuth().getSession({ query: { disableCookieCache: 'true' } });
}
