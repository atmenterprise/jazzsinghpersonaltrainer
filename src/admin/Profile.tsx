'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
export default function Profile() {
  const { user, isLoading } = useUser();
  if (isLoading) return <p role="status">Loading your profile…</p>;
  if (!user) return null;
  return <div className="admin-profile"><strong>{user.name || user.email}</strong><span>{user.email}</span></div>;
}
