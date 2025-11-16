import { defineConfig } from 'vite';

export default defineConfig({
  root: './frontend',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: '../backend/public/dist',
    emptyOutDir: true
  }
});
