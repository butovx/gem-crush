import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
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
