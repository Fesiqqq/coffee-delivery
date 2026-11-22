import { createContext } from 'react'
import type { CartLine, DeliveryAddress, Order, PaymentMethod } from '../types'

export interface CartContextValue {
  items: CartLine[]
  totalQuantity: number
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
  lastOrder: Order | null
  addItem: (coffeeId: string, quantity: number) => void
  increment: (coffeeId: string) => void
  decrement: (coffeeId: string) => void
  removeItem: (coffeeId: string) => void
  /** Gera o snapshot do pedido, salva e limpa o carrinho. Retorna `null` se o carrinho estiver vazio. */
  placeOrder: (address: DeliveryAddress, paymentMethod: PaymentMethod) => Order | null
}

export const CartContext = createContext<CartContextValue | null>(null)
