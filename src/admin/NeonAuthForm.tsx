'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authClient } from '../lib/neon';
import Brand from './Brand';
import type { AuthPath } from '../lib/auth-paths';

const titles: Record<AuthPath, string> = {
  'sign-in': 'Welcome back.', 'sign-up': 'Your studio starts here.',
  'forgot-password': 'Reset your password.', 'reset-password': 'Choose a new password.',
  'verify-email': 'Verify your email.',
};

export default function NeonAuthForm({ path }: { path: AuthPath }) {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const resetToken = params.get('token');
  const invalidReset = path === 'reset-password' && (!resetToken || Boolean(params.get('error')));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const email = String(values.get('email') || '').trim();
    const password = String(values.get('password') || '');
    const callbackURL = `${window.location.origin}/admin`;
    setBusy(true); setError(''); setNotice('');
    try {
      if (path === 'sign-in') {
        const result = await authClient.signIn.email({ email, password, callbackURL });
        if (result.error) throw new Error(result.error.message || 'Unable to sign in.');
        window.location.assign('/admin');
      } else if (path === 'sign-up') {
        const result = await authClient.signUp.email({ email, password, name: String(values.get('name') || '').trim(), callbackURL });
        if (result.error) throw new Error(result.error.message || 'Unable to create your account.');
        const session = await authClient.getSession();
        if (session.data?.user) window.location.assign('/admin');
        else setNotice('Account created. Check your email for a verification link, then sign in.');
      } else if (path === 'forgot-password') {
        const result = await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/auth/reset-password` });
        if (result.error) throw new Error(result.error.message || 'Unable to request a password reset.');
        setNotice('If an account exists for that email, you will receive a password reset link.');
      } else if (path === 'reset-password') {
        if (!resetToken || invalidReset) throw new Error('This reset link is invalid. Request a new one.');
        const result = await authClient.resetPassword({ token: resetToken, newPassword: password });
        if (result.error) throw new Error(result.error.message || 'Unable to reset your password.');
        setNotice('Your password has been updated. You can now sign in.');
      } else {
        const result = await authClient.sendVerificationEmail({ email, callbackURL });
        if (result.error) throw new Error(result.error.message || 'Unable to send the verification email.');
        setNotice('Check your inbox for a verification link.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to contact Neon Auth. Please try again.');
    } finally { setBusy(false); }
  }

  return <main className="admin-root admin-login"><div className="admin-auth-card">
    <Brand /><p className="admin-eyebrow">PRIVATE WORKSPACE</p><h1>{titles[path]}</h1>
    <p>{path === 'sign-up' ? 'Create an account, then ask your team for project access.' : 'Manage your websites with ATM Content Studio.'}</p>
    {error && <p className="admin-auth-error" role="alert">{error}</p>}
    {notice && <p className="admin-auth-notice" role="status">{notice}</p>}
    {invalidReset ? <p role="alert">This reset link is missing or expired. <Link href="/auth/forgot-password">Request a new link</Link>.</p> :
      <form onSubmit={submit}><fieldset disabled={busy}>
        {path === 'sign-up' && <label>Name<input name="name" autoComplete="name" required maxLength={150} /></label>}
        {path !== 'reset-password' && <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
        {['sign-in', 'sign-up', 'reset-password'].includes(path) && <label>{path === 'reset-password' ? 'New password' : 'Password'}
          <input name="password" type="password" autoComplete={path === 'sign-in' ? 'current-password' : 'new-password'} required minLength={path === 'sign-in' ? 1 : 8} maxLength={128} />
        </label>}
        <button className="admin-primary admin-auth-submit" type="submit">{busy ? 'Please wait…' : path === 'sign-in' ? 'Sign in →' : path === 'sign-up' ? 'Create account →' : path === 'reset-password' ? 'Save new password' : path === 'verify-email' ? 'Send verification email' : 'Send reset link'}</button>
      </fieldset></form>}
    <nav className="admin-auth-links" aria-label="Authentication">
      {path !== 'sign-in' && <Link href="/auth/sign-in">Sign in</Link>}
      {path === 'sign-in' && <><Link href="/auth/sign-up">Create an account</Link><Link href="/auth/forgot-password">Forgot password?</Link><Link href="/auth/verify-email">Resend verification email</Link></>}
    </nav>
    <small>Developed by ATM Enterprise · Apps That Matter</small>
  </div></main>;
}
