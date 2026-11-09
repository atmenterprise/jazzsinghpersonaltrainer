import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Next serves public/ directly; avoid recursively copying public/site/.
  build: { copyPublicDir: mode !== 'next-public' },
  server: { proxy: { '/api': 'http://localhost:3000', '/auth': 'http://localhost:3000' } },
}));
