/**
 * Resolves a path in `public/` against the base the site is served from.
 *
 * Media paths are written as '/media/...' in the data files, which is correct
 * at the root but 404s wherever the site sits under a prefix — GitHub Pages
 * serves this project from /fairwaytours/. Vite exposes that prefix as
 * BASE_URL ('/' on Netlify), so every public asset goes through here.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
