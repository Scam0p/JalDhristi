import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: [
        '**/backend/**',
        '**/backend/data/**',
        '**/firmware/**',
        '**/*.db',
        '**/*.db-wal',
        '**/*.db-shm',
        '**/*.db*',
        (file: string) => file.includes('/backend/') || file.includes('.db') || file.includes('/firmware/')
      ]
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true
      }
    }
  }
});
