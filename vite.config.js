import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fetchInstagramProfile, proxyAvatarImage } from './server/instagramService.js';

function instagramApiPlugin() {
  return {
    name: 'instagram-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://localhost');
        const pathname = parsedUrl.pathname;

        // Route: /api/instagram/:username
        if (pathname.startsWith('/api/instagram/')) {
          const username = pathname.replace('/api/instagram/', '').split('?')[0];
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
          try {
            const data = await fetchInstagramProfile(username);
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ exists: false, error: err.message }));
          }
          return;
        }

        // Route: /api/avatar-proxy?url=...
        if (pathname === '/api/avatar-proxy') {
          const targetUrl = parsedUrl.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url param');
            return;
          }
          await proxyAvatarImage(targetUrl, res);
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    instagramApiPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/payment.php': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
});
