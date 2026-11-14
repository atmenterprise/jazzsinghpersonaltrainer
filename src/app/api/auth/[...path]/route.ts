import { getNeonAuth } from '@/lib/neon-server';
import { AuthError } from '../../../../../server/auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ path: string[] }> };
async function handler(request: Request, context: Context) {
  try {
    const methods = getNeonAuth().handler();
    return await methods[request.method as keyof typeof methods](request, context);
  } catch (error) {
    return Response.json({ message: error instanceof AuthError ? error.message : 'Neon Auth is unavailable. Please try again.' }, {
      status: 503, headers: { 'Cache-Control': 'no-store' },
    });
  }
}
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
