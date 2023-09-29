import react from '@vitejs/plugin-react-swc';
import path from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
        manualChunks: {
          // firebase
          firebase: ['firebase/app', 'firebase/auth'],
          // react
          react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
          // radix-ui
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-icons',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          // hook-form and resolver
          'react-hook-form': ['react-hook-form', '@hookform/resolvers'],
          // axios
          axios: ['axios'],
          // react-lottie
          'react-lottie': ['@alfonmga/react-lottie-light-ts'],
          // zod
          zod: ['zod'],
        },
      },
    },
  },
});
