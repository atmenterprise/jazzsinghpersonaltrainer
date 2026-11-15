'use client';
import { createContext, useContext } from 'react';
import { authClient } from '../lib/neon';
export const AdminSessionContext = createContext(null);
export function useAdminAuth() {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error('Admin session provider is required.');
  return value;
}
export function loginWithRedirect() {
  window.location.assign('/auth/sign-in');
}
export async function logout() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message || 'Unable to sign out.');
  window.location.assign('/auth/sign-in');
}
