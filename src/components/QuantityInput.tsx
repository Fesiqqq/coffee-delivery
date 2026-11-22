import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import styled from 'styled-components'
import { MAX_QUANTITY, MIN_QUANTITY } from '../utils/cart'

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};

  button {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.accentStrong};
    transition: color 0.15s, background-color 0.15s;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentSoft};
    }

    &:disabled {
      opacity: 0.4;
    }
  }

  output {
    min-width: 1.5rem;
    text-align: center;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.title};
  }
`

interface QuantityInputProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  /** Nome do produto para compor os rótulos acessíveis. */
  label: string
  min?: number
  max?: number
}

/** Controle de quantidade reutilizado no catálogo e no carrinho (RF-02, RF-05). */
export function QuantityInput({
  value,
  onIncrement,
  onDecrement,
  label,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
}: QuantityInputProps) {
  return (
    <Wrapper role="group" aria-label={`Quantidade de ${label}`}>
      <button type="button" onClick={onDecrement} disabled={value <= min} aria-label={`Diminuir quantidade de ${label}`}>
        <MinusIcon size={16} weight="bold" aria-hidden />
      </button>
      <output aria-live="polite" aria-label={`${value} unidade${value === 1 ? '' : 's'}`}>
        {value}
      </output>
      <button type="button" onClick={onIncrement} disabled={value >= max} aria-label={`Aumentar quantidade de ${label}`}>
        <PlusIcon size={16} weight="bold" aria-hidden />
      </button>
    </Wrapper>
  )
}
