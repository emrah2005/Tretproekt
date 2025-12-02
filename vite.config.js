import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
        plugins: [
        laravel({
input: ['./frontend/**/*.html', './frontend/js/app.js'],
        }),
        tailwindcss(),
    ],
});
