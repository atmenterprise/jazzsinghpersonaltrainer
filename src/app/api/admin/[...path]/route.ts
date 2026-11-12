import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createNextAdminApi } from '../../../../../server/next-api';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const handler = createNextAdminApi({ getSession: (request: NextRequest) => auth0.getSession(request), getAccessToken: () => auth0.getAccessToken() });
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
