import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import manifest from './manifest.config'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [react(), crx({ manifest }), tsconfigPaths()],
  server: {
    watch: {
      usePolling: true,
    },
  },
})
