import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import manifest from './manifest.config'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/assets': resolve(__dirname, './src/assets'),
    },
  },
})
