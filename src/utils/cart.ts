import type { CartItem, CartLine, Coffee } from '../types'

/** Taxa de entrega fixa fictícia — única fonte desse valor no código (RN-03). */
export const DELIVERY_FEE_IN_CENTS = 350

/** Limites de quantidade por item (RN-01). */
export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 99

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY
}

export function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity))
}

/**
 * Resolve os itens persistidos com o catálogo. Itens cujo café não existe
 * mais são descartados (RN-10).
 */
export function buildCartLines(
  items: readonly CartItem[],
  findCoffee: (id: string) => Coffee | undefined,
): CartLine[] {
  return items.flatMap((item) => {
    const coffee = findCoffee(item.coffeeId)
    if (!coffee) return []
    return [{ ...item, coffee, lineTotalInCents: coffee.priceInCents * item.quantity }]
  })
}

/** Soma das unidades — usada no badge do Header (RF-04). */
export function countUnits(items: readonly { quantity: number }[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

/** subtotal = Σ (preço unitário × quantidade), em centavos (RN-03). */
export function calculateSubtotal(lines: readonly { lineTotalInCents: number }[]): number {
  return lines.reduce((total, line) => total + line.lineTotalInCents, 0)
}

/** Sem itens não há entrega a cobrar. */
export function calculateDeliveryFee(subtotalInCents: number): number {
  return subtotalInCents > 0 ? DELIVERY_FEE_IN_CENTS : 0
}

export function calculateTotal(subtotalInCents: number, deliveryFeeInCents: number): number {
  return subtotalInCents + deliveryFeeInCents
}

export function summarizeCart(lines: readonly CartLine[]) {
  const subtotalInCents = calculateSubtotal(lines)
  const deliveryFeeInCents = calculateDeliveryFee(subtotalInCents)
  return {
    totalQuantity: countUnits(lines),
    subtotalInCents,
    deliveryFeeInCents,
    totalInCents: calculateTotal(subtotalInCents, deliveryFeeInCents),
  }
}
