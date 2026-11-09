'use client';
import React, { useCallback, useEffect, useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import Brand from './Brand';
import { AdminSessionContext, loginWithRedirect, logout } from './session';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
function AuthScreen({ title, children }) {
  return <main className="admin-root admin-login"><div className="admin-auth-card">
    <Brand /><p className="admin-eyebrow">PRIVATE WORKSPACE</p><h1>{title}</h1>{children}
  </div></main>;
}
export default function AdminAuth({ initialSignedIn = true, setupError = '' }) {
  const [session, setSession] = useState(initialSignedIn ? null : { authenticated: false });
  const [error, setError] = useState(setupError);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(initialSignedIn && !setupError);
  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'ATM Content Studio';
    return () => { document.title = oldTitle; };
  }, []);
  useEffect(() => {
    if (setupError || (!initialSignedIn && !attempt)) return;
    const controller = new AbortController();
    setLoading(true); setError('');
    (async () => {
      try {
        const response = await fetch('/api/admin/auth/status', { credentials: 'same-origin', signal: controller.signal });
        const result = await response.json().catch(() => { throw new Error('Admin API returned a non-JSON response. Check the Next.js deployment and function logs.'); });
        if (!response.ok) throw new Error(result.error || 'Unable to check authentication.');
        if (!controller.signal.aborted) setSession(result);
      } catch (e) { if (!controller.signal.aborted) { setError(e.message); setSession(null); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [attempt, initialSignedIn, setupError]);
  const retry = useCallback(() => { if (setupError) window.location.reload(); else setAttempt(v => v + 1); }, [setupError]);
  if (loading) return <AuthScreen title="Opening your workspace…"><p role="status">Checking your session.</p></AuthScreen>;
  if (error) return <AuthScreen title="Admin setup needed"><p role="alert">{error}</p><button onClick={retry}>Try again</button><small>Server settings are configured in Vercel or your local .env file. No VITE_AUTH0 variables are required.</small></AuthScreen>;
  if (!session?.authenticated) return <AuthScreen title={<>Every project.<br />One content studio.</>}>
    <p>Manage your websites with ATM Content Studio, built by ATM Enterprise.</p>
    <LoginButton signup />
    <LoginButton />
    <small>Create your account, then ask your team for content access.</small>
  </AuthScreen>;
  if (!session.approved) return <AuthScreen title="Your admin account"><Profile />
    <p role="alert">{session.error || 'Your account is awaiting admin approval.'}</p>
    <button className="admin-primary" onClick={retry}>Check access again</button><LoginButton /><LogoutButton />
  </AuthScreen>;
  return <AdminSessionContext.Provider value={{ user: session.user, loginWithRedirect, logout }}><ProjectWorkspace /></AdminSessionContext.Provider>;
}
