import { ShoppingCartIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useCart } from '../hooks/useCart'

const CartLink = styled(Link)`
  position: relative;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.brandSoft};
  color: ${({ theme }) => theme.colors.brandStrong};
`

const Count = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.brandStrong};
  color: ${({ theme }) => theme.colors.onBrandStrong};
  font-size: 0.75rem;
  font-weight: 700;
`

/** Badge com a SOMA das unidades do carrinho (RF-04). */
export function CartBadge() {
  const { totalQuantity } = useCart()
  const label =
    totalQuantity === 0
      ? 'Carrinho vazio'
      : `Carrinho com ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'itens'}`

  return (
    <CartLink to="/checkout" aria-label={label}>
      <ShoppingCartIcon size={22} weight="fill" aria-hidden />
      {totalQuantity > 0 && (
        <Count aria-hidden data-testid="cart-count">
          {totalQuantity}
        </Count>
      )}
      <span className="sr-only" aria-live="polite">
        {totalQuantity > 0 ? `${totalQuantity} no carrinho` : ''}
      </span>
    </CartLink>
  )
}
