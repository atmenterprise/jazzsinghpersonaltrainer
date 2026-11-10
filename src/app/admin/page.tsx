import { adminAuthDisabled } from '../../../server/admin-test-access';
import { auth0 } from '@/lib/auth0';
import AdminAuth from '../../admin/AdminAuth';
import { sessionSettings } from '../../../server/session-auth';
export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  if (adminAuthDisabled()) return <AdminAuth initialSignedIn={true} />;
  let setupError = '';
  let signedIn = false;
  try { sessionSettings(); signedIn = Boolean(await auth0.getSession()); }
  catch (error) { setupError = error instanceof Error ? error.message : 'Unable to initialize admin authentication.'; }
  return <AdminAuth initialSignedIn={signedIn} setupError={setupError} />;
}
