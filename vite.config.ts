import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// snehaakumaran.github.io is a GitHub *user* site, served from the domain root,
// so assets resolve from "/" — no sub-path base is needed.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    // The lazily-loaded 3D chunk (three.js + react-three-fiber) is ~250 kB gzipped.
    chunkSizeWarningLimit: 1100,
  },
});
