import React, { useEffect, useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import ProjectWorkspace from './ProjectWorkspace';
import Brand from './Brand';
import './admin.css';

function AuthScreen({ title, children }) {
  return <main className="admin-root admin-login"><div className="admin-auth-card">
    <Brand />
    <p className="admin-eyebrow">PRIVATE WORKSPACE</p><h1>{title}</h1>{children}
  </div></main>;
}
function AdminGate() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [access, setAccess] = useState({ status: 'checking', message: '' });
  const [actionError, setActionError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const controller = new AbortController();
    setAccess({ status: 'checking', message: '' });
    (async () => {
      try {
        const token = await getAccessTokenSilently({ cacheMode: attempt ? 'off' : 'on' });
        if (controller.signal.aborted) return;
        const response = await fetch('/api/admin/session', { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'Unable to verify admin access. Please try again.');
        if (!controller.signal.aborted) setAccess({ status: 'approved', message: '' });
      } catch (e) {
        if (!controller.signal.aborted) setAccess({ status: 'denied', message: e.message });
      }
    })();
    return () => controller.abort();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, attempt]);
  async function signIn(signup = false) {
    setActionError(''); setRedirecting(true);
    try { await loginWithRedirect({ authorizationParams: { screen_hint: signup ? 'signup' : 'login' } }); }
    catch { setActionError('Unable to open authentication. Please try again.'); setRedirecting(false); }
  }
  async function signOut() {
    try { await logout({ logoutParams: { returnTo: `${window.location.origin}/admin` } }); }
    catch { setActionError('Unable to sign out. Please try again.'); }
  }
  if (isLoading) return <AuthScreen title="Opening your workspace…"><p role="status">Checking your session.</p></AuthScreen>;
  if (error) return <AuthScreen title="Sign-in interrupted"><p role="alert">Authentication could not be completed. Please try again.</p><button className="admin-primary" disabled={redirecting} onClick={() => signIn()}>Try sign in again</button>{actionError && <p role="alert">{actionError}</p>}</AuthScreen>;
  if (!isAuthenticated) return <AuthScreen title={<>Every project.<br />One content studio.</>}>
    <p>Manage your websites with ATM Content Studio, built by ATM Enterprise.</p>
    <button className="admin-primary" disabled={redirecting} onClick={() => signIn(true)}>Create your account →</button>
    <button disabled={redirecting} onClick={() => signIn()}>Already registered? Sign in</button>
    <small>Create your account, then ask your team for content access.</small>
    {actionError && <p role="alert">{actionError}</p>}
  </AuthScreen>;
  if (access.status !== 'approved') return <AuthScreen title={access.status === 'checking' ? 'Checking access…' : 'Your admin account'}>
    <p>{user?.email || user?.name}</p>
    {access.status === 'checking' ? <p role="status">Confirming your content permissions.</p> : <><p role="alert">{access.message}</p><button className="admin-primary" onClick={() => setAttempt(v => v + 1)}>Check access again</button><button onClick={() => signIn()}>Sign in again</button></>}
    <button onClick={signOut}>Sign out</button>{actionError && <p role="alert">{actionError}</p>}
  </AuthScreen>;
  return <ProjectWorkspace />;
}
export default function AdminAuth() {
  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'ATM Content Studio';
    return () => { document.title = oldTitle; };
  }, []);
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  if (!domain || !clientId || !audience) return <AuthScreen title="Admin setup needed"><p>Configure the Auth0 domain, client ID and API audience to enable admin accounts.</p><small>See the admin setup guide for the required environment settings.</small></AuthScreen>;
  return <Auth0Provider domain={domain} clientId={clientId} cacheLocation="memory"
    authorizationParams={{ redirect_uri: `${window.location.origin}/admin`, audience, scope: 'openid profile email' }}
    onRedirectCallback={() => navigate('/admin', { replace: true })}>
    <AdminGate />
  </Auth0Provider>;
}
