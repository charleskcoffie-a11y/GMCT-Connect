import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icons/icon-192x192.svg', 'icons/icon-512x512.svg'],
          manifest: {
            name: 'GMCT Connect',
            short_name: 'GMCT',
            description: 'GMCT Connect — Church app for announcements, devotions, and more.',
            theme_color: '#0f172a',
            background_color: '#0f172a',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: 'icons/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any'
              },
              {
                src: 'icons/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any'
              }
            ],
            shortcuts: [
              { name: 'Dashboard', url: '/#/dashboard', description: 'Open Dashboard' },
              { name: 'Devotion', url: '/#/devotion', description: 'Daily Devotions' },
              { name: 'Announcements', url: '/#/announcements', description: 'Latest Announcements' }
            ]
          },
          workbox: {
            navigateFallback: '/index.html',
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.destination === 'document',
                handler: 'NetworkFirst',
                options: { cacheName: 'html-cache' }
              },
              {
                urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
                handler: 'StaleWhileRevalidate',
                options: { cacheName: 'asset-cache' }
              },
              {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'CacheFirst',
                options: { cacheName: 'image-cache', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1024,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-router': ['react-router-dom'],
              'vendor-firebase': ['firebase/app', 'firebase/firestore']
            }
          }
        }
      }
    };
});
