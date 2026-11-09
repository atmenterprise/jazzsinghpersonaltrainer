import { createContext, useContext } from 'react';
export const AdminSessionContext = createContext(null);
export function useAdminAuth() {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error('Admin session provider is required.');
  return value;
}
// Authentication tokens remain in the server's encrypted HttpOnly session cookie.
export function loginWithRedirect(options = {}) {
  const screen = options.authorizationParams?.screen_hint === 'signup' ? 'signup' : 'login';
  window.location.assign(`/api/admin/auth/login?screen_hint=${screen}`);
}
export function logout() {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/api/admin/auth/logout';
  document.body.appendChild(form);
  form.submit();
}
