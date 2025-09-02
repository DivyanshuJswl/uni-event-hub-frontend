import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from 'path';

export default defineConfig({
  plugins: [react({
      // This tells Vite to process .js files with JSX too
      include: ['**/*.jsx', '**/*.js', '**/*.tsx', '**/*.ts'],
    }), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    global: 'globalThis', // Add global definition
  }
})