import type { CartItem, CartState } from '../../types'
import { MAX_QUANTITY, MIN_QUANTITY, isValidQuantity } from '../../utils/cart'
import type { CartAction } from './actions'

export const initialCartState: CartState = { items: [] }

/** Aplica `update` apenas ao item com o id informado, sem mutar o array original. */
function updateItem(
  items: CartItem[],
  coffeeId: string,
  update: (item: CartItem) => CartItem,
): CartItem[] {
  return items.map((item) => (item.coffeeId === coffeeId ? update(item) : item))
}

/**
 * Reducer puro do carrinho.
 * - RN-01: quantidade inteira entre 1 e 99; `DECREMENT` não desce de 1.
 * - RN-02: adicionar um café existente soma a quantidade, sem nova linha.
 * Quando nada muda, devolve o MESMO estado para evitar re-renderizações.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { coffeeId, quantity } = action.payload
      if (!isValidQuantity(quantity)) return state

      const existing = state.items.find((item) => item.coffeeId === coffeeId)
      if (!existing) {
        return { ...state, items: [...state.items, { coffeeId, quantity }] }
      }

      const nextQuantity = Math.min(MAX_QUANTITY, existing.quantity + quantity)
      if (nextQuantity === existing.quantity) return state
      return {
        ...state,
        items: updateItem(state.items, coffeeId, (item) => ({ ...item, quantity: nextQuantity })),
      }
    }

    case 'INCREMENT': {
      const target = state.items.find((item) => item.coffeeId === action.payload.coffeeId)
      if (!target || target.quantity >= MAX_QUANTITY) return state
      return {
        ...state,
        items: updateItem(state.items, target.coffeeId, (item) => ({ ...item, quantity: item.quantity + 1 })),
      }
    }

    case 'DECREMENT': {
      const target = state.items.find((item) => item.coffeeId === action.payload.coffeeId)
      if (!target || target.quantity <= MIN_QUANTITY) return state
      return {
        ...state,
        items: updateItem(state.items, target.coffeeId, (item) => ({ ...item, quantity: item.quantity - 1 })),
      }
    }

    case 'REMOVE': {
      const items = state.items.filter((item) => item.coffeeId !== action.payload.coffeeId)
      return items.length === state.items.length ? state : { ...state, items }
    }

    case 'CLEAR':
      return state.items.length === 0 ? state : { ...state, items: [] }

    default:
      return state
  }
}
