/** The public website remains a Vite SPA; Next owns admin/auth/API routes. */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return {
      beforeFiles: [{ source: '/assets/:path*', destination: '/site/assets/:path*' }],
      afterFiles: [],
      fallback: [{
        source: '/:path((?!admin(?:/|$)|api(?:/|$)|auth(?:/|$)|_next(?:/|$)|site(?:/|$)|assets(?:/|$)).*)',
        destination: '/site/index.html',
      }],
    };
  },
};
export default nextConfig;
