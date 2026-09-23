import { defineConfig } from 'vite';

export default defineConfig({
  // Production base URL for GitHub Pages /gem-crush/
  base: process.env.NODE_ENV === 'production' ? '/gem-crush/' : '/',
  // index.html at project root (standard Vite convention)
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
  server: {
    port: 3000,
    open: true,
  },
});
