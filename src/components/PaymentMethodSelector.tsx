import { BankIcon, CreditCardIcon, CurrencyDollarIcon, MoneyIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import type { CheckoutFormInput } from '../schemas/checkout'
import type { PaymentMethod } from '../types'
import { PAYMENT_LABELS } from '../utils/payment'
import { Panel, PanelHeader } from './ui'

const Fieldset = styled.fieldset`
  border: 0;
  min-width: 0;

  legend {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
`

const Options = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const Option = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;

  svg {
    color: ${({ theme }) => theme.colors.accent};
    flex-shrink: 0;
  }

  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    cursor: pointer;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }

  &:has(input:checked) {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.title};
    font-weight: 700;
  }

  &:has(input:focus-visible) {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`

const ErrorText = styled.p`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
`

const icons: Record<PaymentMethod, ReactNode> = {
  credit: <CreditCardIcon size={18} aria-hidden />,
  debit: <BankIcon size={18} aria-hidden />,
  cash: <MoneyIcon size={18} aria-hidden />,
}

const methods: PaymentMethod[] = ['credit', 'debit', 'cash']

/** Pagamento obrigatório e apenas informativo (RF-09, RN-05). Radios nativos = teclado grátis. */
export function PaymentMethodSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormInput>()
  const error = errors.paymentMethod?.message

  return (
    <Panel aria-labelledby="pagamento-titulo">
      <PanelHeader $tone="accent">
        <CurrencyDollarIcon size={22} aria-hidden />
        <div>
          <h3 id="pagamento-titulo">Pagamento</h3>
          <p>O pagamento é feito na entrega. Escolha a forma que deseja pagar</p>
        </div>
      </PanelHeader>

      <Fieldset aria-describedby={error ? 'pagamento-erro' : undefined} aria-invalid={error ? true : undefined}>
        <legend>Forma de pagamento</legend>
        <Options>
          {methods.map((method) => (
            <Option key={method}>
              <input type="radio" value={method} {...register('paymentMethod')} />
              {icons[method]}
              {PAYMENT_LABELS[method]}
            </Option>
          ))}
        </Options>
        {error && <ErrorText id="pagamento-erro">{error}</ErrorText>}
      </Fieldset>
    </Panel>
  )
}
