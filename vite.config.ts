import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Включаем dev mode чтобы SW работал и локально
      devOptions: {
        enabled: true,
        type: 'module',
      },
      // Явно указываем файлы для прекеширования
      includeAssets: ['logo.svg', 'icons/*.png', 'icons/*.jpg'],
      workbox: {
        // Все навигационные запросы → index.html (SPA)
        navigateFallback: 'index.html',
        // Не применять navigateFallback к API/манифесту
        navigateFallbackDenylist: [/^\/api/, /manifest\.webmanifest$/],
        // Стратегия для JS/CSS/изображений — сначала кеш
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Удалять старые кеши при обновлении SW
        cleanupOutdatedCaches: true,
        // Активировать SW сразу без ожидания перезагрузки
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'SeaWallet',
        short_name: 'SeaWallet',
        description: 'Калькулятор зарплаты и трекер расходов для моряков',
        theme_color: '#048390',
        background_color: '#0a4f55',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ru',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})