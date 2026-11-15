'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { authClient } from '../lib/neon';
import { logout } from './session';
import Brand from './Brand';

export default function NeonAccount() {
  const { data, isPending, error: sessionError, refetch } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function run(action: () => Promise<{ error: { message?: string } | null }>, message: string) {
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await action();
      if (result.error) throw new Error(result.error.message || 'Unable to update your account.');
      setNotice(message); await refetch();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update your account.'); }
    finally { setBusy(false); }
  }
  function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get('name') || '').trim();
    void run(() => authClient.updateUser({ name }), 'Profile updated.');
  }
  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    void run(async () => {
      const result = await authClient.changePassword({ currentPassword: String(values.get('currentPassword')), newPassword: String(values.get('newPassword')), revokeOtherSessions: true });
      if (!result.error) form.reset();
      return result;
    }, 'Password changed. Other sessions have been signed out.');
  }

  return <main className="admin-root admin-login"><div className="admin-auth-card admin-account-card">
    <Brand /><p className="admin-eyebrow">YOUR ACCOUNT</p><h1>Account settings.</h1>
    {isPending ? <p role="status">Loading your account…</p> : sessionError ? <p role="alert">Unable to load your session. <button onClick={() => refetch()}>Try again</button></p> : !data?.user ? <p><Link href="/auth/sign-in">Sign in</Link> to manage your account.</p> : <>
      <p>{data.user.email}</p><small>User ID</small><code className="admin-user-id">{data.user.id}</code>
      {error && <p className="admin-auth-error" role="alert">{error}</p>}
      {notice && <p className="admin-auth-notice" role="status">{notice}</p>}
      <form onSubmit={updateProfile}><fieldset disabled={busy}><h2>Profile</h2>
        <label>Name<input key={data.user.name} name="name" defaultValue={data.user.name} required maxLength={150} autoComplete="name" /></label>
        <button type="submit">Save profile</button>
      </fieldset></form>
      <form onSubmit={changePassword}><fieldset disabled={busy}><h2>Password</h2>
        <label>Current password<input type="password" name="currentPassword" required autoComplete="current-password" /></label>
        <label>New password<input type="password" name="newPassword" required minLength={8} maxLength={128} autoComplete="new-password" /></label>
        <button type="submit">Change password</button>
      </fieldset></form>
      <section><h2>Sessions</h2><p>Sign out other browsers and devices while keeping this session open.</p>
        <button disabled={busy} onClick={() => void run(() => authClient.revokeOtherSessions(), 'Other sessions have been signed out.')}>Sign out other devices</button>
        <button disabled={busy} onClick={async () => { setBusy(true); try { await logout(); } catch { setError('Unable to sign out. Please try again.'); setBusy(false); } }}>Sign out</button>
      </section>
    </>}
    <Link className="admin-auth-button" href="/admin">← Back to studio</Link>
  </div></main>;
}
