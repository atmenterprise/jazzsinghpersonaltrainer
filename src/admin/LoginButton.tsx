'use client';
export default function LoginButton({ signup = false }: { signup?: boolean }) {
  return <a className={signup ? 'admin-auth-button admin-primary' : 'admin-auth-button'} href={`/auth/login?screen_hint=${signup ? 'signup' : 'login'}&returnTo=%2Fadmin`}>
    {signup ? 'Create your account →' : 'Sign in with Auth0'}
  </a>;
}
