import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    root: 'frontend',
    plugins: [
        laravel({
input: ['**/*.html', 'js/app.js'],
        }),
        tailwindcss(),
    ],
});
