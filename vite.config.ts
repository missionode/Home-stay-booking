import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
base: '/Home-stay-booking/', // Or your repository name if different.
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
