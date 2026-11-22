import type { CartState, Order, PaymentMethod } from '../types'

/** Type guards usados ao ler dados do localStorage (nunca confiar no formato salvo). */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isCartState(value: unknown): value is CartState {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(
      (item) =>
        isRecord(item) &&
        typeof item.coffeeId === 'string' &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )
  )
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'credit' || value === 'debit' || value === 'cash'
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    isRecord(value.address) &&
    typeof value.address.street === 'string' &&
    isPaymentMethod(value.paymentMethod) &&
    typeof value.totalInCents === 'number'
  )
}

export function isOrderOrNull(value: unknown): value is Order | null {
  return value === null || isOrder(value)
}

export function isThemeMode(value: unknown): value is 'light' | 'dark' {
  return value === 'light' || value === 'dark'
}
