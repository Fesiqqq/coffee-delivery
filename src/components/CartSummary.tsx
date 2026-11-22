import styled from 'styled-components'
import { formatBRL } from '../utils/currency'

const List = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;

  div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;
  }

  .total {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.title};
  }
`

interface CartSummaryProps {
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
}

/** Resumo financeiro (RF-10). Recebe valores já calculados em utils/cart.ts. */
export function CartSummary({ subtotalInCents, deliveryFeeInCents, totalInCents }: CartSummaryProps) {
  return (
    <List aria-label="Resumo dos valores">
      <div>
        <dt>Total de itens</dt>
        <dd data-testid="subtotal">{formatBRL(subtotalInCents)}</dd>
      </div>
      <div>
        <dt>Entrega</dt>
        <dd data-testid="delivery">{formatBRL(deliveryFeeInCents)}</dd>
      </div>
      <div className="total">
        <dt>Total</dt>
        <dd data-testid="total">{formatBRL(totalInCents)}</dd>
      </div>
    </List>
  )
}
