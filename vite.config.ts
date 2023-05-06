import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import resolveMetaChromeExtension from './src/utils/plugins/resolveMetaChromeExtension.js';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': root,
    },
  },
  plugins: [react(), tsconfigPaths(), svgr(), resolveMetaChromeExtension()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(pagesDir, 'background', 'index.ts'),
        content: resolve(pagesDir, 'content', 'index.ts'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { dir, name: _name } = path.parse(assetInfo.name as string);
          const assetFolder = dir.split('/').at(-1);
          const name = assetFolder + firstUpperCase(_name);
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, 'g');
  return str.toLowerCase().replace(firstAlphabet, L => L.toUpperCase());
}
