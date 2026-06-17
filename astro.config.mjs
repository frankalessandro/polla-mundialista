// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://polla-mundialista-five-delta.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
