import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html'  // Garante que encontra index.html na raiz
    }
  },
  server: {
    port: 3001,
    open: true
  }
});

