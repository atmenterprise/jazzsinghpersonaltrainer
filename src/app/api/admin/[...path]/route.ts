import { createNextAdminApi } from '../../../../../server/next-api';
import { getAdminSession } from '@/lib/neon-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const handler = createNextAdminApi({ getSession: getAdminSession });
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
