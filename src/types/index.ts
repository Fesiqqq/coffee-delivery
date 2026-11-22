export type CoffeeTag = 'tradicional' | 'gelado' | 'com leite' | 'especial' | 'alcoólico'

export interface Coffee {
  /** Slug estável usado como chave no carrinho. */
  id: string
  name: string
  description: string
  tags: CoffeeTag[]
  /** Preço unitário em centavos (RN-04). */
  priceInCents: number
  image: string
}

/** O que é persistido: apenas a referência e a quantidade. */
export interface CartItem {
  coffeeId: string
  quantity: number
}

/** Linha derivada do carrinho, já resolvida com o catálogo. */
export interface CartLine extends CartItem {
  coffee: Coffee
  lineTotalInCents: number
}

export interface CartState {
  items: CartItem[]
}

export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  uf: string
}

export interface OrderItem {
  coffeeId: string
  name: string
  image: string
  unitPriceInCents: number
  quantity: number
}

/** Snapshot imutável do pedido confirmado (RN-06). */
export interface Order {
  id: string
  createdAt: string
  items: OrderItem[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
}
