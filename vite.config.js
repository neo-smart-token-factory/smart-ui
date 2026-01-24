import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 3000,
        // Note: API routes (/api/*) are Vercel Serverless Functions
        // Use 'vercel dev' or 'npm run dev:vercel' for full API support
        // See DEV_SETUP.md for details
    },
});
