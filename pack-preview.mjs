/**
 * Bundles the built site into one self-contained HTML file for client preview.
 *
 * The preview host serves a single document and blocks external requests, so
 * fonts and imagery are inlined as data URIs — a silent fallback to Georgia and
 * a page full of gradients would both misrepresent the design.
 *
 * Not part of the production build. `npm run build` is unaffected, and the
 * production bundle still loads /media over the network as normal.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { execSync } from 'child_process'

const FONTS = process.argv[2]
const OUT = process.argv[3]
const MEDIA = process.argv[4]
if (!FONTS || !OUT) {
  throw new Error('usage: node pack-preview.mjs <fonts.css> <out.html> [media-inline.json]')
}

execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, VITE_HASH_ROUTER: '1' } })

const assets = readdirSync('dist/assets')
let js = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.js'))}`, 'utf8')
const css = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.css'))}`, 'utf8')
const fonts = readFileSync(FONTS, 'utf8')

/**
 * Swap each /media path for its data URI. The paths reach the bundle as plain
 * string literals from src/data, so a literal replace is sufficient and avoids
 * pulling an image toolchain into the project's dependencies.
 */
let inlined = 0
if (MEDIA) {
  const map = JSON.parse(readFileSync(MEDIA, 'utf8'))
  for (const [path, dataUri] of Object.entries(map)) {
    if (!js.includes(path)) {
      console.warn(`  unused in bundle: ${path}`)
      continue
    }
    js = js.split(path).join(dataUri)
    inlined++
  }
}

const title = readFileSync('index.html', 'utf8').match(/<title>([\s\S]*?)<\/title>/)[1]

// The host wraps this in its own doctype/head/body, so emit page content only.
writeFileSync(
  OUT,
  `<title>${title}</title>
<style>
${fonts}
${css}
/* The host's reset leaves the body transparent; the app expects its own ground. */
body { background: #04140f; margin: 0; }
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`,
)

const kb = (n) => (n / 1024).toFixed(0) + 'KB'
console.log(
  `\n${OUT}\n  js ${kb(js.length)}  css ${kb(css.length)}  fonts ${kb(fonts.length)}  images inlined: ${inlined}`,
)
