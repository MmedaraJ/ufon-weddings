import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/', // e.g. /ufon-weddings/ for GitHub Pages
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
