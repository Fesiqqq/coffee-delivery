// Percorre o fluxo de compra num navegador real e salva evidências em docs/screenshots/.
// Também verifica rolagem horizontal em 320, 375, 768, 1280 e 1440 px (RF-15).
//
// Uso: npm run dev   (em outro terminal)
//      npm run screenshots          # usa o Edge instalado; BROWSER=chrome para o Chrome
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const channel = process.env.BROWSER === 'chrome' ? 'chrome' : 'msedge'
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots')
mkdirSync(outDir, { recursive: true })

const viewports = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1440, height: 900 },
}

const browser = await chromium.launch({ channel })
const problems = []

async function newPage(theme, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: theme })
  await context.addInitScript((t) => {
    if (!localStorage.getItem('coffee-delivery:theme')) localStorage.setItem('coffee-delivery:theme', JSON.stringify(t))
  }, theme)
  // Resposta fixa do ViaCEP: screenshots determinísticos e sem depender da rede.
  await context.route('https://viacep.com.br/ws/**', (route) =>
    route.fulfill({
      json: { cep: '01310-100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP' },
    }),
  )
  return context.newPage()
}

async function shot(page, name) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: true })
  console.log('📸', name)
}

async function runFlow(theme, size) {
  const page = await newPage(theme, viewports[size])
  const tag = `${size}-${theme}`

  await page.goto(BASE_URL)
  await page.getByRole('heading', { name: 'Nossos cafés' }).waitFor()
  await shot(page, `home-${tag}`)

  const latte = page.getByRole('article', { name: 'Latte' })
  await latte.getByRole('button', { name: 'Aumentar quantidade de Latte' }).click()
  await latte.getByRole('button', { name: 'Adicionar 2 Latte ao carrinho' }).click()
  await page
    .getByRole('article', { name: 'Expresso Tradicional' })
    .getByRole('button', { name: /Adicionar 1/ })
    .click()

  await page.getByRole('link', { name: /Carrinho com 3 itens/ }).click()
  await page.getByRole('heading', { name: 'Complete seu pedido' }).waitFor()

  if (size === 'mobile' && theme === 'light') {
    await page.getByRole('button', { name: 'Confirmar pedido' }).click()
    await page.getByRole('alert').waitFor()
    await shot(page, `checkout-errors-${tag}`)
  }

  await page.getByLabel('CEP').fill('01310100')
  await page.waitForFunction(() => document.querySelector('#street')?.value === 'Avenida Paulista')
  await page.getByLabel('Número').fill('1000')
  await page.getByLabel(/Complemento/).fill('Apto 42')
  await page.getByText('Cartão de crédito').click()
  await shot(page, `checkout-${tag}`)

  await page.getByRole('button', { name: 'Confirmar pedido' }).click()
  await page.getByRole('heading', { name: 'Uhu! Pedido confirmado' }).waitFor()
  await shot(page, `success-${tag}`)
  await page.context().close()
}

async function checkOverflow() {
  for (const theme of ['light']) {
    for (const width of [320, 375, 390, 768, 1280, 1440]) {
      const page = await newPage(theme, { width, height: 900 })
      for (const path of ['/', '/checkout', '/success']) {
        await page.goto(BASE_URL + path)
        await page.waitForLoadState('networkidle')
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        if (overflow > 0) problems.push(`${path} @ ${width}px tem ${overflow}px de rolagem horizontal`)
      }
      await page.context().close()
    }
  }
}

try {
  for (const size of ['desktop', 'mobile']) {
    for (const theme of ['light', 'dark']) await runFlow(theme, size)
  }
  await checkOverflow()
} finally {
  await browser.close()
}

if (problems.length) {
  console.error('❌ Problemas de layout:\n' + problems.join('\n'))
  process.exit(1)
}
console.log('✅ Fluxo completo OK e sem rolagem horizontal em 320–1440 px')
