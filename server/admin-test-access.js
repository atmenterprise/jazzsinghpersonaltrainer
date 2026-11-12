// Temporary testing access requested by the owner. Set false to restore Auth0.
export function adminAuthDisabled(env = process.env) {
  return env.ADMIN_AUTH_DISABLED !== 'false';
}
export const testAdmin = { sub: 'temporary-test-admin', name: 'Test admin', email: '' };
