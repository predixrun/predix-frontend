import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import inject from '@rollup/plugin-inject';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto', 'buffer', 'stream', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
  },
  define: {
    global: {},
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  esbuild: {
    // drop: ['console', 'debugger'],
  },
});
