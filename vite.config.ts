import {nodeResolve} from '@rollup/plugin-node-resolve';
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
      input: 'src/main.tsx',
      output: {
        // https://rollupjs.org/guide/en/#outputdir
        dir: 'dist',
        manualChunks: {
          // hook-form and resolver
          'react-hook-form': ['react-hook-form', '@hookform/resolvers'],
          // firebase
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/database',
            'firebase/storage',
          ],
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
          // axios
          axios: ['axios'],
          // react-lottie
          'react-lottie': ['react-lottie'],
          // zod
          zod: ['zod'],
        },
      },
      // https://rollupjs.org/configuration-options/
      plugins: [nodeResolve()],
    },
  },
});
