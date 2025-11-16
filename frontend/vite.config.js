import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  server: {
    port: 5173,
    host: 'localhost',
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
