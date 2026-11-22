import { describe, expect, it } from 'vitest'
import { coffees, findCoffee } from '../data/coffees'
import {
  DELIVERY_FEE_IN_CENTS,
  buildCartLines,
  calculateDeliveryFee,
  calculateSubtotal,
  countUnits,
  summarizeCart,
} from '../utils/cart'
import { formatCep, isCompleteCep, onlyDigits } from '../utils/cep'
import { formatAmount, formatBRL } from '../utils/currency'
import { isCartState, isOrder } from '../utils/guards'

describe('formatBRL (RN-04)', () => {
  it('formata centavos em reais com duas casas', () => {
    expect(formatBRL(990)).toBe('R$ 9,90')
    expect(formatBRL(0)).toBe('R$ 0,00')
    expect(formatBRL(123456)).toBe('R$ 1.234,56')
    expect(formatAmount(1090)).toBe('10,90')
  })
})

describe('cálculos do carrinho (RN-03)', () => {
  const lines = buildCartLines(
    [
      { coffeeId: 'expresso-tradicional', quantity: 3 }, // 9,90
      { coffeeId: 'latte', quantity: 2 }, // 11,90
    ],
    findCoffee,
  )

  it('evita erro de ponto flutuante calculando em centavos', () => {
    // 3 × 9,90 em float daria 29.700000000000003
    expect(lines[0].lineTotalInCents).toBe(2970)
    expect(calculateSubtotal(lines)).toBe(2970 + 2380)
  })

  it('soma unidades, não tipos de produto (RF-04)', () => {
    expect(countUnits(lines)).toBe(5)
  })

  it('total = subtotal + entrega (RF-10)', () => {
    expect(summarizeCart(lines)).toEqual({
      totalQuantity: 5,
      subtotalInCents: 5350,
      deliveryFeeInCents: DELIVERY_FEE_IN_CENTS,
      totalInCents: 5350 + DELIVERY_FEE_IN_CENTS,
    })
  })

  it('não cobra entrega com carrinho vazio', () => {
    expect(calculateDeliveryFee(0)).toBe(0)
    expect(summarizeCart([]).totalInCents).toBe(0)
  })

  it('descarta itens que não existem mais no catálogo (RN-10)', () => {
    expect(buildCartLines([{ coffeeId: 'cafe-fantasma', quantity: 1 }], findCoffee)).toEqual([])
  })

  it('catálogo tem ids únicos e preços inteiros em centavos', () => {
    expect(new Set(coffees.map((c) => c.id)).size).toBe(coffees.length)
    expect(coffees.every((c) => Number.isInteger(c.priceInCents) && c.priceInCents > 0)).toBe(true)
  })
})

describe('CEP', () => {
  it('aplica máscara e valida 8 dígitos', () => {
    expect(formatCep('01310100')).toBe('01310-100')
    expect(formatCep('0131')).toBe('0131')
    expect(formatCep('01310-100999')).toBe('01310-100')
    expect(onlyDigits('01.310-100')).toBe('01310100')
    expect(isCompleteCep('01310-10')).toBe(false)
    expect(isCompleteCep('01310-100')).toBe(true)
  })
})

describe('guards do localStorage (RNF-04)', () => {
  it('rejeita formatos inválidos', () => {
    expect(isCartState({ items: [{ coffeeId: 'latte', quantity: 1 }] })).toBe(true)
    expect(isCartState({ items: [{ coffeeId: 'latte', quantity: -1 }] })).toBe(false)
    expect(isCartState([])).toBe(false)
    expect(isOrder({ id: 'x', items: [] })).toBe(false)
  })
})
