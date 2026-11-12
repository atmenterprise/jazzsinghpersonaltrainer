import 'server-only';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Use trusted deployment origins, including the stable branch preview hostname.
const hosts = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter((host): host is string => Boolean(host));
const appBaseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || (hosts.length ? [...new Set(hosts.map(host => `https://${host}`))] : 'http://localhost:3000');
export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN?.replace(/^https:\/\//, '').replace(/\/$/, ''),
  appBaseUrl,
  signInReturnToPath: '/admin',
  enableAccessTokenEndpoint: false,
  authorizationParameters: { scope: 'openid profile email', ...(process.env.AUTH0_AUDIENCE ? { audience: process.env.AUTH0_AUDIENCE } : {}) },
  session: { rolling: false, absoluteDuration: 8 * 60 * 60, cookie: { name: 'atm_next_session', sameSite: 'lax' } },
});
