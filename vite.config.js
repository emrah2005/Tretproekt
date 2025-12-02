import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['frontend/index.html', 'frontend/js/app.js'],
      refresh: true,
    }),
    tailwindcss(),
  ],
});
