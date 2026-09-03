import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * A relative base emits './assets/...' rather than '/assets/...', so the same
 * build works at the domain root and under the GitHub Pages /fairwaytours/
 * project path. VITE_BASE can still override it if a deployment ever needs an
 * absolute prefix.
 *
 * The router's mount point is worked out at runtime instead — see
 * src/lib/basename.ts.
 *
 * https://vite.dev/config/
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
