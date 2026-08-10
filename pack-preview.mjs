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

/**
 * The preview host serves text/html with no charset parameter, so a browser
 * falls back to windows-1252 and every ā, °, · and em dash renders as mojibake.
 * We cannot set a response header and a <meta charset> lands after the host's
 * own </head>, so the reliable fix is to ship no non-ASCII bytes at all.
 *
 * \uXXXX is valid in JS strings, template literals and regex, which is where
 * every one of these characters lives in a bundle built from this source.
 */
const asciiJs = (s) =>
  s.replace(/[\u0080-\uFFFF]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)

/** CSS uses a different escape form, and needs the trailing space to terminate. */
const asciiCss = (s) =>
  s.replace(/[\u0080-\uFFFF]/g, (c) => `\\${c.charCodeAt(0).toString(16).padStart(4, '0')} `)

const safeJs = asciiJs(js)
const safeCss = asciiCss(css)
const safeTitle = title.replace(/[\u0080-\uFFFF]/g, (c) => `&#${c.charCodeAt(0)};`)

// The host wraps this in its own doctype/head/body, so emit page content only.
// The meta is belt and braces: the encoding sniffer scans the first 1024 bytes
// of the document regardless of which element it sits in.
const out = `<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
${fonts}
${safeCss}
/* The host's reset leaves the body transparent; the app expects its own ground. */
body { background: #04140f; margin: 0; }
</style>
<div id="root"></div>
<script type="module">
${safeJs}
</script>
`

const nonAscii = out.match(/[\u0080-\uFFFF]/g)
if (nonAscii) {
  throw new Error(`packed output still has ${nonAscii.length} non-ASCII bytes, e.g. ${nonAscii[0]}`)
}

writeFileSync(OUT, out)

const kb = (n) => (n / 1024).toFixed(0) + 'KB'
console.log(
  `\n${OUT}\n  js ${kb(safeJs.length)}  css ${kb(safeCss.length)}  fonts ${kb(fonts.length)}  images inlined: ${inlined}`,
)
