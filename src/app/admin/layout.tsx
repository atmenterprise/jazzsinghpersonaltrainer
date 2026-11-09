import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { auth0 } from '@/lib/auth0';
import { sessionSettings } from '../../../server/session-auth';
import '../../admin/admin.css';
export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    sessionSettings();
    const session = await auth0.getSession();
    if (session?.user) {
      const { sub, name, email, picture } = session.user;
      user = { sub, name, email, picture };
    }
  } catch { /* The admin page reports configuration/session errors. */ }
  return <Auth0Provider user={user}>{children}</Auth0Provider>;
}
