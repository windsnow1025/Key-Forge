import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/Key-Forge/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Key Forge',
        short_name: 'KeyForge',
        description: 'Master key based SHA password derivation and AES text cipher',
        theme_color: '#121212',
      },
      // pwa assets
      pwaAssets: {
        // options
      }
    })
  ],
})
