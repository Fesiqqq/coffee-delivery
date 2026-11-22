// Gera as ilustrações (vista de cima) dos cafés do catálogo em src/assets/coffees/.
// Uso: node scripts/generate-coffee-art.mjs
// Substituem as fotos do Figma por arte vetorial própria (sem problemas de direito de uso).
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'coffees')

const heart = (c) =>
  `<path d="M60 78c-14-9-22-17-22-26a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 9-8 17-22 26z" fill="${c}"/>`
const rosetta = (c) =>
  `<g fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round">
    <path d="M60 40v44"/><path d="M48 48q12 8 24 0"/><path d="M45 58q15 9 30 0"/><path d="M46 68q14 8 28 0"/><path d="M51 77q9 5 18 0"/></g>`
const swirl = (c) =>
  `<g fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round">
    <path d="M60 60m-20 0a20 20 0 1 0 20-20a14 14 0 1 0 14 14a8 8 0 1 0-8 8"/></g>`
const dots = (c) =>
  [[52, 52], [68, 50], [60, 64], [48, 70], [72, 68], [62, 76], [56, 44]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')
const ice = () =>
  [[44, 46, 12], [64, 42, -8], [56, 64, 20], [74, 62, 4]]
    .map(([x, y, r]) =>
      `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" transform="rotate(${r} ${x} ${y})" fill="#E6F4FF" fill-opacity=".75" stroke="#fff" stroke-opacity=".9"/>`).join('')
const leaf = () =>
  `<path d="M60 46c10 2 14 10 10 20-10-2-14-10-10-20z" fill="#7FB069"/><path d="M60 46l10 20" stroke="#4E7F3B" stroke-width="1.5"/>`
const pineapple = () =>
  `<path d="M58 60l12-12 12 12-12 12z" fill="#F4C542" stroke="#D9A21B" stroke-width="2"/><path d="M70 48l-4-8M70 48l4-8M70 48l0-10" stroke="#5E9E44" stroke-width="3" stroke-linecap="round"/>`

/** @type {Array<{file:string, liquid:string, crema:string, art?:string}>} */
const coffees = [
  { file: 'expresso', liquid: '#3B1F12', crema: '#8A5A2B', art: dots('#C79A63') },
  { file: 'americano', liquid: '#2A150B', crema: '#5C3A1E' },
  { file: 'expresso-cremoso', liquid: '#6B4023', crema: '#C8925A', art: swirl('#E8C595') },
  { file: 'expresso-gelado', liquid: '#4A2A17', crema: '#7A4B28', art: ice() },
  { file: 'cafe-com-leite', liquid: '#B9875A', crema: '#D9B38C', art: dots('#F3E2CC') },
  { file: 'latte', liquid: '#C99B6D', crema: '#E8CFAF', art: heart('#FBF1E3') },
  { file: 'capuccino', liquid: '#A66E3F', crema: '#D7AE80', art: rosetta('#FBF1E3') },
  { file: 'macchiato', liquid: '#E7D2B5', crema: '#F6EBDC', art: `<circle cx="60" cy="60" r="10" fill="#7A4B28"/>` },
  { file: 'mocaccino', liquid: '#5A2E1C', crema: '#9A5D3C', art: swirl('#F1DDC5') },
  { file: 'chocolate-quente', liquid: '#4E2214', crema: '#7D3E25', art: dots('#2B110A') },
  { file: 'cubano', liquid: '#3A1C10', crema: '#7A3E1E', art: leaf() + ice() },
  { file: 'havaiano', liquid: '#5B3720', crema: '#9C6B42', art: pineapple() },
  { file: 'arabe', liquid: '#2E180C', crema: '#6C4426', art: dots('#C9A46A') },
  { file: 'irlandes', liquid: '#2C140A', crema: '#F4E8D6', art: `<circle cx="60" cy="60" r="18" fill="#F7EEDF"/>` },
]

function svg({ liquid, crema, art = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img">
  <ellipse cx="62" cy="64" rx="56" ry="54" fill="#000" opacity=".12"/>
  <circle cx="60" cy="60" r="56" fill="#F5F3F1"/>
  <circle cx="60" cy="60" r="56" fill="none" stroke="#E2DEDA" stroke-width="2"/>
  <path d="M102 60h10a8 8 0 0 1 0 16h-8" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
  <circle cx="60" cy="60" r="44" fill="#FFFFFF"/>
  <circle cx="60" cy="60" r="44" fill="none" stroke="#E7E3E0" stroke-width="2"/>
  <circle cx="60" cy="60" r="37" fill="${crema}"/>
  <circle cx="60" cy="60" r="33" fill="${liquid}"/>
  ${art}
  <ellipse cx="44" cy="38" rx="10" ry="4" transform="rotate(-35 44 38)" fill="#fff" opacity=".18"/>
</svg>\n`
}

mkdirSync(outDir, { recursive: true })
for (const coffee of coffees) {
  writeFileSync(join(outDir, `${coffee.file}.svg`), svg(coffee))
  console.log('✔', coffee.file)
}
