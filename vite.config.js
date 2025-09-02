import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react({
      // This tells Vite to process .js files with JSX too
      include: ['**/*.jsx', '**/*.js', '**/*.tsx', '**/*.ts'],
    }), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    target: 'es2015'
  },
  define: {
    global: 'globalThis', // Add global definition
  }
})