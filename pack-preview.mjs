/**
 * Bundles the built site into one self-contained HTML file for client preview.
 * Fonts are inlined as data URIs because the preview host blocks external
 * requests, and a silent fallback to Georgia would misrepresent the design.
 * Not part of the production build — `npm run build` is unaffected.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { execSync } from 'child_process'

const FONTS = process.argv[2]
const OUT = process.argv[3]
if (!FONTS || !OUT) throw new Error('usage: node pack-preview.mjs <fonts.css> <out.html>')

execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, VITE_HASH_ROUTER: '1' } })

const assets = readdirSync('dist/assets')
const js = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.js'))}`, 'utf8')
const css = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.css'))}`, 'utf8')
const fonts = readFileSync(FONTS, 'utf8')

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
console.log(`\n${OUT}  js ${kb(js.length)}  css ${kb(css.length)}  fonts ${kb(fonts.length)}`)
