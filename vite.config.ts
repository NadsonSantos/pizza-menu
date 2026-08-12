import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'offline.html'],
      manifest: {
        name: "Rê Pizza's — Cardápio Digital",
        short_name: 'Cardápio',
        description: 'Cardápio digital de pizzaria — Monte seu pedido e envie pelo WhatsApp',
        theme_color: '#EF8A1F',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpeg,jpg,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/menu\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'menu-cache',
              expiration: { maxEntries: 1, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
})
