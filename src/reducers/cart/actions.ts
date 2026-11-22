export type CartAction =
  | { type: 'ADD_ITEM'; payload: { coffeeId: string; quantity: number } }
  | { type: 'INCREMENT'; payload: { coffeeId: string } }
  | { type: 'DECREMENT'; payload: { coffeeId: string } }
  | { type: 'REMOVE'; payload: { coffeeId: string } }
  | { type: 'CLEAR' }

export const cartActions = {
  addItem: (coffeeId: string, quantity: number): CartAction => ({
    type: 'ADD_ITEM',
    payload: { coffeeId, quantity },
  }),
  increment: (coffeeId: string): CartAction => ({ type: 'INCREMENT', payload: { coffeeId } }),
  decrement: (coffeeId: string): CartAction => ({ type: 'DECREMENT', payload: { coffeeId } }),
  remove: (coffeeId: string): CartAction => ({ type: 'REMOVE', payload: { coffeeId } }),
  clear: (): CartAction => ({ type: 'CLEAR' }),
}
