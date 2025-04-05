import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from "path";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
    drop: ['console', 'debugger'],
  },
});
