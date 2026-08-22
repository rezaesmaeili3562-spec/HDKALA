import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// تنظیمات Vite — https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // مسیر نسبی → خروجی build روی هر میزبانی (حتی file://) درست کار می‌کند
  base: './',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true
  }
});
