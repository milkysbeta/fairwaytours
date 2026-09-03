/**
 * Where the app is mounted, worked out at runtime rather than baked in.
 *
 * The same build has to serve from three places: the domain root
 * (fairwaytours.co.nz, and Netlify), the GitHub Pages project path
 * (/fairwaytours/), and a standalone file for the client preview. Baking the
 * prefix in at build time meant the two URLs could never both work, and
 * switching it in advance of the DNS once left both broken.
 *
 * Vite is configured with a relative base, so assets resolve against the
 * document and need no prefix. Only the router needs to know, and it can read
 * the prefix off the URL it was loaded from.
 */
const KNOWN_PREFIXES = ['/fairwaytours']

export function routerBasename(pathname = window.location.pathname): string {
  const prefix = KNOWN_PREFIXES.find((p) => pathname === p || pathname.startsWith(`${p}/`))
  return prefix ?? '/'
}
