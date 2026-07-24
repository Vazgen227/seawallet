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
      manifest: {
        name: 'SeaWallet',
        short_name: 'SeaWallet',
        description: 'Калькулятор зарплаты и трекер расходов для моряков',
        theme_color: '#048390',
        background_color: '#EDE1CF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/contract',
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})