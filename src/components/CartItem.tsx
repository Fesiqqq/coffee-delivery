import { TrashIcon } from '@phosphor-icons/react'
import styled from 'styled-components'
import type { CartLine } from '../types'
import { formatBRL } from '../utils/currency'
import { QuantityInput } from './QuantityInput'

const Row = styled.li`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.75rem 1.25rem;
  align-items: start;
  padding-block: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 64px;
    height: 64px;
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.text};
    font-weight: 400;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.title};
  }

  > strong {
    text-align: right;
    color: ${({ theme }) => theme.colors.title};
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  text-transform: uppercase;

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.danger};
    svg {
      color: currentColor;
    }
  }
`

interface CartItemProps {
  line: CartLine
  onIncrement: (coffeeId: string) => void
  onDecrement: (coffeeId: string) => void
  onRemove: (coffeeId: string) => void
}

/** Linha do carrinho (RF-05). Em 1 unidade o "−" fica desabilitado; remover é explícito (RN-01). */
export function CartItem({ line, onIncrement, onDecrement, onRemove }: CartItemProps) {
  const { coffee, quantity } = line

  return (
    <Row>
      <img src={coffee.image} alt="" width={64} height={64} />
      <div>
        <h4>{coffee.name}</h4>
        <Actions>
          <QuantityInput
            label={coffee.name}
            value={quantity}
            onIncrement={() => onIncrement(coffee.id)}
            onDecrement={() => onDecrement(coffee.id)}
          />
          <RemoveButton type="button" onClick={() => onRemove(coffee.id)} aria-label={`Remover ${coffee.name} do carrinho`}>
            <TrashIcon size={16} aria-hidden />
            Remover
          </RemoveButton>
        </Actions>
      </div>
      <strong aria-label={`Total do item: ${formatBRL(line.lineTotalInCents)}`}>{formatBRL(line.lineTotalInCents)}</strong>
    </Row>
  )
}
