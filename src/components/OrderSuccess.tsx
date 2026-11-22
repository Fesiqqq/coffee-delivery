import { CurrencyDollarIcon, MapPinIcon, ReceiptIcon, TimerIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import type { Order } from '../types'
import { formatBRL } from '../utils/currency'
import { PAYMENT_LABELS } from '../utils/payment'
import { PrimaryLink } from './ui'

const Layout = styled.div`
  display: grid;
  gap: 2.5rem;
  padding-top: clamp(2rem, 6vw, 5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  h1 {
    font-size: clamp(1.75rem, 5vw, 2rem);
    font-weight: 800;
    color: ${({ theme }) => theme.colors.brandStrong};
  }

  > div > p {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.title};
    margin-top: 0.25rem;
  }
`

/** Borda em gradiente amarelo → roxo, como no Figma. */
const InfoBox = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.5rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.card};
  background:
    linear-gradient(${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}) padding-box,
    linear-gradient(102deg, ${({ theme }) => theme.colors.brand}, ${({ theme }) => theme.colors.accent}) border-box;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: ${({ theme }) => theme.colors.text};
  }

  strong {
    color: ${({ theme }) => theme.colors.title};
  }
`

const Bullet = styled.span<{ $tone: 'accent' | 'brand' | 'brandStrong' }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme, $tone }) => theme.colors[$tone]};
  color: ${({ theme }) => theme.colors.background};
`

const Receipt = styled.section`
  padding: clamp(1.25rem, 4vw, 2rem);
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    align-items: center;
    gap: 0.75rem;
    padding-block: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.875rem;
  }

  img {
    width: 40px;
    height: 40px;
  }

  dl {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    div {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .total {
      font-size: 1.125rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.title};
    }
  }

  ${PrimaryLink} {
    width: 100%;
    margin-top: 1.5rem;
  }
`

function InfoItem({ icon, tone, children }: { icon: ReactNode; tone: 'accent' | 'brand' | 'brandStrong'; children: ReactNode }) {
  return (
    <li>
      <Bullet $tone={tone}>{icon}</Bullet>
      <div>{children}</div>
    </li>
  )
}

/** Mostra o SNAPSHOT do pedido — não depende do carrinho atual (RF-12, RF-13). */
export function OrderSuccess({ order }: { order: Order }) {
  const { address } = order
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Layout>
      <div>
        <h1>Uhu! Pedido confirmado</h1>
        <p>Agora é só aguardar que logo o café chegará até você</p>

        <InfoBox aria-label="Dados da entrega">
          <InfoItem tone="accent" icon={<MapPinIcon size={16} weight="fill" aria-hidden />}>
            Entrega em{' '}
            <strong>
              {address.street}, {address.number}
              {address.complement ? ` – ${address.complement}` : ''}
            </strong>
            <br />
            {address.neighborhood} – {address.city}, {address.uf} · CEP {address.cep}
          </InfoItem>
          <InfoItem tone="brand" icon={<TimerIcon size={16} weight="fill" aria-hidden />}>
            Previsão de entrega
            <br />
            <strong>20 min – 30 min</strong>
          </InfoItem>
          <InfoItem tone="brandStrong" icon={<CurrencyDollarIcon size={16} aria-hidden />}>
            Pagamento na entrega
            <br />
            <strong>{PAYMENT_LABELS[order.paymentMethod]}</strong>
          </InfoItem>
        </InfoBox>
      </div>

      <Receipt aria-labelledby="resumo-pedido">
        <h2 id="resumo-pedido">
          <ReceiptIcon size={22} aria-hidden /> Pedido {order.id}
        </h2>
        <p className="sr-only">{totalUnits} unidades</p>
        <ul>
          {order.items.map((item) => (
            <li key={item.coffeeId}>
              <img src={item.image} alt="" width={40} height={40} />
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatBRL(item.unitPriceInCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Total de itens</dt>
            <dd>{formatBRL(order.subtotalInCents)}</dd>
          </div>
          <div>
            <dt>Entrega</dt>
            <dd>{formatBRL(order.deliveryFeeInCents)}</dd>
          </div>
          <div className="total">
            <dt>Total</dt>
            <dd>{formatBRL(order.totalInCents)}</dd>
          </div>
        </dl>
        <PrimaryLink to="/">Fazer outro pedido</PrimaryLink>
      </Receipt>
    </Layout>
  )
}
