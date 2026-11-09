'use client';
import { logout } from './session';
export default function LogoutButton() {
  return <a className="admin-auth-button" href="/auth/logout" onClick={event => { event.preventDefault(); logout(); }}>Sign out</a>;
}
