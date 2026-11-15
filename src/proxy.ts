import { NextRequest, NextResponse } from 'next/server';
import { getNeonAuth } from './lib/neon-server';

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/atm-logo.svg') return NextResponse.next();
  try {
    return await getNeonAuth().middleware({ loginUrl: '/auth/sign-in' })(request);
  } catch {
    // Admin status and the auth proxy report configuration failures as JSON.
    return NextResponse.next();
  }
}
// Public website/assets and JSON APIs stay outside redirecting middleware.
// Every content API independently verifies the session and project membership.
export const config = { matcher: ['/admin/:path*', '/auth/:path*'] };
