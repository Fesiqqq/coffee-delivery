// Gera os arquivos SVG da marca Café Lua (símbolo, logo horizontal e favicon).
// Uso: node scripts/generate-brand.mjs
// O desenho foi proposto por IA (Claude, Anthropic) e curado manualmente — ver README > Branding com IA.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const palettes = {
  light: { cup: '#4B2995', coffee: '#C47F17', moon: '#DBAC2C', text: '#272221' },
  dark: { cup: '#C4B0FF', coffee: '#DBAC2C', moon: '#F1C24A', text: '#F3F2F2' },
}

/** Símbolo: xícara roxa cujo vapor sobe até uma lua crescente amarela. */
function symbol({ cup, coffee, moon }, id) {
  return `
  <defs>
    <mask id="crescent-${id}">
      <rect width="64" height="64" fill="#fff"/>
      <circle cx="42.5" cy="9.5" r="8.5" fill="#000"/>
    </mask>
  </defs>
  <circle cx="38" cy="14" r="10" fill="${moon}" mask="url(#crescent-${id})"/>
  <path d="M22 27c-3.5-4 3.5-6 0-10.5" fill="none" stroke="${moon}" stroke-width="3" stroke-linecap="round"/>
  <path d="M30 27c-3-3.2 3-5 0-8.4" fill="none" stroke="${moon}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <path d="M44 34h3.5a7 7 0 0 1 0 14H42" fill="none" stroke="${cup}" stroke-width="4" stroke-linecap="round"/>
  <path d="M8 30h40v5a20 20 0 0 1-20 20A20 20 0 0 1 8 35z" fill="${cup}"/>
  <ellipse cx="28" cy="31" rx="17" ry="2.6" fill="${coffee}"/>
  <rect x="4" y="57" width="48" height="4" rx="2" fill="${cup}"/>`
}

const files = {}

for (const [mode, palette] of Object.entries(palettes)) {
  files[`src/assets/brand/logo-symbol-${mode}.svg`] =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Café Lua">${symbol(palette, mode)}\n</svg>\n`

  files[`src/assets/brand/logo-horizontal-${mode}.svg`] =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236 64" role="img" aria-label="Café Lua">${symbol(palette, `h-${mode}`)}
  <text x="70" y="44" font-family="'Baloo 2', 'Trebuchet MS', sans-serif" font-size="34" font-weight="800" fill="${palette.text}">Café <tspan fill="${palette.cup}">Lua</tspan></text>
</svg>\n`
}

// Favicon: símbolo claro-escuro sobre quadrado roxo, legível em abas claras e escuras.
files['public/favicon.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#4B2995"/>
  <g transform="translate(5 3) scale(.86)">${symbol({ cup: '#F3F2F2', coffee: '#C47F17', moon: '#F1C24A' }, 'fav')}
  </g>
</svg>\n`

for (const [file, content] of Object.entries(files)) {
  const target = join(root, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
  console.log('✔', file)
}
