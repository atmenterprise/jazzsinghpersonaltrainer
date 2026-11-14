import { notFound } from 'next/navigation';
import NeonAuthForm from '../../../admin/NeonAuthForm';
import { authPaths } from '@/lib/auth-paths';
export const dynamic = 'force-dynamic';

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const validPath = authPaths.find(value => value === path);
  if (!validPath) notFound();
  return <NeonAuthForm key={validPath} path={validPath} />;
}
