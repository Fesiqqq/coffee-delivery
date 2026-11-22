import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { Container } from '../components/Container'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { EmptyState } from '../components/EmptyState'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { PrimaryButton } from '../components/ui'
import { useCart } from '../hooks/useCart'
import { checkoutSchema, type CheckoutFormData, type CheckoutFormInput } from '../schemas/checkout'

const Form = styled.form`
  display: grid;
  gap: 2rem;
  padding-top: 2.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: start;
  }

  h2 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`

const CartPanel = styled.section`
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ul {
    list-style: none;
  }

  ${PrimaryButton} {
    width: 100%;
    margin-top: 1.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + 1rem);
  }
`

const Alert = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`

const defaultValues: CheckoutFormInput = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  uf: '',
  // RHF usa `null` para "nenhum radio marcado"; o Zod rejeita e mostra a mensagem.
  paymentMethod: null as unknown as CheckoutFormInput['paymentMethod'],
}

export function Checkout() {
  const navigate = useNavigate()
  const { items, subtotalInCents, deliveryFeeInCents, totalInCents, increment, decrement, removeItem, placeOrder } =
    useCart()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const isEmpty = items.length === 0

  function onValid(data: CheckoutFormData) {
    const { paymentMethod, ...address } = data
    const order = placeOrder({ ...address, complement: address.complement || undefined }, paymentMethod)
    if (!order) {
      setSubmitError('Seu carrinho está vazio. Adicione um café antes de confirmar.')
      return
    }
    navigate('/success', { replace: true })
  }

  function onInvalid(errors: FieldErrors<CheckoutFormInput>) {
    const count = Object.keys(errors).length
    setSubmitError(
      `Não foi possível confirmar: ${count} ${count === 1 ? 'campo precisa' : 'campos precisam'} de atenção.`,
    )
  }

  return (
    <Container>
      <FormProvider {...methods}>
        <Form id="checkout-form" noValidate onSubmit={methods.handleSubmit(onValid, onInvalid)}>
          <Column>
            <h2>Complete seu pedido</h2>
            <DeliveryAddressForm />
            <PaymentMethodSelector />
          </Column>

          <Column>
            <h2>Cafés selecionados</h2>
            <CartPanel aria-label="Carrinho">
              {isEmpty ? (
                <EmptyState
                  headingLevel="h3"
                  icon={<ShoppingCartSimpleIcon size={40} aria-hidden />}
                  title="Seu carrinho está vazio"
                  description="Escolha seus cafés no catálogo para continuar."
                  action={{ to: '/', label: 'Ver cafés' }}
                />
              ) : (
                <ul>
                  {items.map((line) => (
                    <CartItem
                      key={line.coffeeId}
                      line={line}
                      onIncrement={increment}
                      onDecrement={decrement}
                      onRemove={removeItem}
                    />
                  ))}
                </ul>
              )}

              <CartSummary
                subtotalInCents={subtotalInCents}
                deliveryFeeInCents={deliveryFeeInCents}
                totalInCents={totalInCents}
              />

              <PrimaryButton
                type="submit"
                disabled={isEmpty || methods.formState.isSubmitting}
                aria-describedby={submitError ? 'checkout-erro' : undefined}
              >
                Confirmar pedido
              </PrimaryButton>

              {(submitError || isEmpty) && (
                <Alert id="checkout-erro" role="alert">
                  {isEmpty ? 'Adicione pelo menos um café para confirmar o pedido.' : submitError}
                </Alert>
              )}
            </CartPanel>
          </Column>
        </Form>
      </FormProvider>
    </Container>
  )
}
