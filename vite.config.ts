import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * `base` is the path the site is served from. Netlify and the real domain serve
 * from the root, so it defaults to '/'. GitHub Pages serves a project site from
 * /<repo>/, and the Pages workflow sets VITE_BASE to match.
 *
 * https://vite.dev/config/
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
