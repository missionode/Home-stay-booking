import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Home-stay-booking/', // Set the base URL to match your GitHub Pages URL
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
