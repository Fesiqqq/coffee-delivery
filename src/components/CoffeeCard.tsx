import { CheckIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import type { Coffee } from '../types'
import { MAX_QUANTITY, MIN_QUANTITY } from '../utils/cart'
import { formatAmount, formatBRL } from '../utils/currency'
import { QuantityInput } from './QuantityInput'

const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.25rem 1.25rem;
  margin-top: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 16px ${({ theme }) => theme.colors.shadow};

  img {
    width: 120px;
    height: 120px;
    margin-top: -1.25rem;
  }

  h3 {
    margin-top: 1rem;
    font-size: 1.25rem;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
    flex: 1;
  }
`

const Tags = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.75rem;

  li {
    padding: 0.25rem 0.5rem;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.brandSoft};
    color: ${({ theme }) => theme.colors.brandStrong};
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1.5rem;
`

const Price = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.title};
    margin-left: 0.125rem;
  }
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AddButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentStrong};
  color: ${({ theme }) => theme.colors.onAccent};
  transition: background-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }

  &[data-added='true'] {
    background: ${({ theme }) => theme.colors.success};
  }
`

interface CoffeeCardProps {
  coffee: Coffee
  onAdd: (coffeeId: string, quantity: number) => void
}

export function CoffeeCard({ coffee, onAdd }: CoffeeCardProps) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  const [justAdded, setJustAdded] = useState(false)
  const headingId = `coffee-${coffee.id}`

  useEffect(() => {
    if (!justAdded) return
    const timeout = window.setTimeout(() => setJustAdded(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [justAdded])

  function handleAdd() {
    onAdd(coffee.id, quantity)
    setQuantity(MIN_QUANTITY)
    setJustAdded(true)
  }

  return (
    <Card aria-labelledby={headingId}>
      <img src={coffee.image} alt={`Xícara de ${coffee.name} vista de cima`} width={120} height={120} loading="lazy" />
      <Tags aria-label="Categorias">
        {coffee.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </Tags>
      <h3 id={headingId}>{coffee.name}</h3>
      <p>{coffee.description}</p>

      <Footer>
        <Price aria-label={`Preço: ${formatBRL(coffee.priceInCents)}`}>
          R$<strong>{formatAmount(coffee.priceInCents)}</strong>
        </Price>
        <Controls>
          <QuantityInput
            label={coffee.name}
            value={quantity}
            onDecrement={() => setQuantity((q) => Math.max(MIN_QUANTITY, q - 1))}
            onIncrement={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          />
          <AddButton
            type="button"
            onClick={handleAdd}
            data-added={justAdded}
            aria-label={`Adicionar ${quantity} ${coffee.name} ao carrinho`}
            title="Adicionar ao carrinho"
          >
            {justAdded ? (
              <CheckIcon size={22} weight="bold" aria-hidden />
            ) : (
              <ShoppingCartIcon size={22} weight="fill" aria-hidden />
            )}
          </AddButton>
        </Controls>
      </Footer>
      <span className="sr-only" role="status">
        {justAdded ? `${coffee.name} adicionado ao carrinho` : ''}
      </span>
    </Card>
  )
}
