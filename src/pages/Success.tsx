import { ReceiptXIcon } from '@phosphor-icons/react'
import styled from 'styled-components'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { OrderSuccess } from '../components/OrderSuccess'
import { useCart } from '../hooks/useCart'

const EmptyWrapper = styled.div`
  padding-top: 4rem;
`

export function Success() {
  const { lastOrder } = useCart()

  if (!lastOrder) {
    return (
      <Container>
        <EmptyWrapper>
          <EmptyState
            icon={<ReceiptXIcon size={48} aria-hidden />}
            title="Nenhum pedido encontrado"
            description="Você ainda não confirmou um pedido. Que tal escolher um café?"
            action={{ to: '/', label: 'Ver cafés' }}
          />
        </EmptyWrapper>
      </Container>
    )
  }

  return (
    <Container>
      <OrderSuccess order={lastOrder} />
    </Container>
  )
}
