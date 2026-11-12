'use client';
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
  window.location.assign(`/auth/login?screen_hint=${screen}&returnTo=%2Fadmin`);
}
export function logout() {
  window.location.assign(`/auth/logout?returnTo=${encodeURIComponent(`${window.location.origin}/admin`)}`);
}
