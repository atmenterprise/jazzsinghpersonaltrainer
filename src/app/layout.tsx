import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'ATM Content Studio', description: 'Manage project content with ATM Enterprise.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
