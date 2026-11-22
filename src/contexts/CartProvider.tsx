import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { findCoffee } from '../data/coffees'
import { readStorage, useLocalStorage, writeStorage } from '../hooks/useLocalStorage'
import { cartActions } from '../reducers/cart/actions'
import { cartReducer, initialCartState } from '../reducers/cart/reducer'
import type { CartState, DeliveryAddress, Order, PaymentMethod } from '../types'
import { buildCartLines, summarizeCart } from '../utils/cart'
import { isCartState, isOrderOrNull } from '../utils/guards'
import { STORAGE_KEYS } from '../utils/storage-keys'
import { CartContext, type CartContextValue } from './CartContext'

function loadCart(): CartState {
  return readStorage(STORAGE_KEYS.cart, initialCartState, isCartState)
}

function createOrderId(): string {
  return `CL-${Date.now().toString(36).toUpperCase()}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicialização lazy: o localStorage é lido uma única vez (RF-06).
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [lastOrder, setLastOrder] = useLocalStorage<Order | null>(STORAGE_KEYS.lastOrder, null, isOrderOrNull)

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, state)
  }, [state])

  // Linhas e totais são DERIVADOS do estado — nunca armazenados (RN-03).
  const items = useMemo(() => buildCartLines(state.items, findCoffee), [state.items])
  const summary = useMemo(() => summarizeCart(items), [items])

  const addItem = useCallback((coffeeId: string, quantity: number) => {
    dispatch(cartActions.addItem(coffeeId, quantity))
  }, [])
  const increment = useCallback((coffeeId: string) => dispatch(cartActions.increment(coffeeId)), [])
  const decrement = useCallback((coffeeId: string) => dispatch(cartActions.decrement(coffeeId)), [])
  const removeItem = useCallback((coffeeId: string) => dispatch(cartActions.remove(coffeeId)), [])

  const placeOrder = useCallback(
    (address: DeliveryAddress, paymentMethod: PaymentMethod): Order | null => {
      if (items.length === 0) return null // RN-10

      // Snapshot: cópia dos dados atuais, independente do carrinho (RN-06, RF-13).
      const order: Order = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),
        items: items.map((line) => ({
          coffeeId: line.coffeeId,
          name: line.coffee.name,
          image: line.coffee.image,
          unitPriceInCents: line.coffee.priceInCents,
          quantity: line.quantity,
        })),
        address: { ...address },
        paymentMethod,
        subtotalInCents: summary.subtotalInCents,
        deliveryFeeInCents: summary.deliveryFeeInCents,
        totalInCents: summary.totalInCents,
      }

      setLastOrder(order)
      dispatch(cartActions.clear())
      return order
    },
    [items, summary, setLastOrder],
  )

  const value = useMemo<CartContextValue>(
    () => ({ items, ...summary, lastOrder, addItem, increment, decrement, removeItem, placeOrder }),
    [items, summary, lastOrder, addItem, increment, decrement, removeItem, placeOrder],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
