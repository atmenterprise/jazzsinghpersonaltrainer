import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';
import { sessionSettings } from '../server/session-auth';
export async function proxy(request: NextRequest) {
  try { sessionSettings(); }
  catch (error) {
    // Let /admin render actionable setup instructions instead of a proxy error.
    if (!request.nextUrl.pathname.startsWith('/auth/')) return NextResponse.next();
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Auth0 configuration is missing.' }, { status: 503 });
  }
  try { return await auth0.middleware(request); }
  catch {
    if (request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
    return NextResponse.json({ error: 'Auth0 session middleware failed. Check APP_BASE_URL and the deployment configuration.' }, { status: 503 });
  }
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*', '/auth/:path*'] };
