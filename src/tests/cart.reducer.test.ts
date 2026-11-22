import { describe, expect, it } from 'vitest'
import { cartActions } from '../reducers/cart/actions'
import { cartReducer, initialCartState } from '../reducers/cart/reducer'
import type { CartState } from '../types'

/** Congela profundamente para provar que o reducer não muta o estado anterior. */
function frozen(state: CartState): CartState {
  state.items.forEach((item) => Object.freeze(item))
  Object.freeze(state.items)
  return Object.freeze(state)
}

describe('cartReducer', () => {
  it('adiciona um novo café (RF-03)', () => {
    const state = cartReducer(frozen({ items: [] }), cartActions.addItem('latte', 2))
    expect(state.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
  })

  it('acumula a quantidade do mesmo café sem duplicar linhas (RN-02)', () => {
    let state = cartReducer(initialCartState, cartActions.addItem('latte', 1))
    state = cartReducer(frozen(state), cartActions.addItem('latte', 3))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(4)
  })

  it.each([0, -1, 1.5, Number.NaN])('ignora quantidade inválida %s (RN-01)', (quantity) => {
    const before = frozen({ items: [] })
    expect(cartReducer(before, cartActions.addItem('latte', quantity))).toBe(before)
  })

  it('limita a quantidade máxima em 99', () => {
    const state = cartReducer(frozen({ items: [{ coffeeId: 'latte', quantity: 98 }] }), cartActions.addItem('latte', 5))
    expect(state.items[0].quantity).toBe(99)
    const same = cartReducer(frozen(state), cartActions.increment('latte'))
    expect(same).toBe(state)
  })

  it('incrementa e decrementa sem afetar outros itens (RF-05)', () => {
    const before = frozen({
      items: [
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'arabe', quantity: 1 },
      ],
    })
    const incremented = cartReducer(before, cartActions.increment('latte'))
    expect(incremented.items).toEqual([
      { coffeeId: 'latte', quantity: 3 },
      { coffeeId: 'arabe', quantity: 1 },
    ])
    expect(incremented.items[1]).toBe(before.items[1])

    const decremented = cartReducer(frozen(incremented), cartActions.decrement('latte'))
    expect(decremented.items[0].quantity).toBe(2)
  })

  it('não desce abaixo de 1 no decremento (RN-01)', () => {
    const before = frozen({ items: [{ coffeeId: 'latte', quantity: 1 }] })
    expect(cartReducer(before, cartActions.decrement('latte'))).toBe(before)
  })

  it('remove um item individualmente', () => {
    const before = frozen({
      items: [
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'arabe', quantity: 1 },
      ],
    })
    expect(cartReducer(before, cartActions.remove('latte')).items).toEqual([{ coffeeId: 'arabe', quantity: 1 }])
  })

  it('limpa o carrinho (RF-13)', () => {
    const before = frozen({ items: [{ coffeeId: 'latte', quantity: 2 }] })
    expect(cartReducer(before, cartActions.clear()).items).toEqual([])
  })

  it('devolve o mesmo estado para ações em itens inexistentes', () => {
    const before = frozen({ items: [{ coffeeId: 'latte', quantity: 2 }] })
    expect(cartReducer(before, cartActions.increment('nao-existe'))).toBe(before)
    expect(cartReducer(before, cartActions.remove('nao-existe'))).toBe(before)
  })
})
