import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        rollupOptions: {
            input: './index.html'  // Garante que encontra index.html na raiz
        }
    },
    server: {
        port: 3002  // Changed from 3001 to avoid conflict with landing
    }
})
