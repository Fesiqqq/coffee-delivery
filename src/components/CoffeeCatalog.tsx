import styled from 'styled-components'
import { useCart } from '../hooks/useCart'
import type { Coffee } from '../types'
import { CoffeeCard } from './CoffeeCard'

const Section = styled.section`
  h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 1.5rem;
  }
`

const Grid = styled.ul`
  list-style: none;
  display: grid;
  gap: 2rem 1.5rem;
  grid-template-columns: 1fr;

  > li {
    display: flex;
  }

  > li > article {
    flex: 1;
  }

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export function CoffeeCatalog({ coffees }: { coffees: readonly Coffee[] }) {
  const { addItem } = useCart()

  return (
    <Section aria-labelledby="catalogo-titulo">
      <h2 id="catalogo-titulo">Nossos cafés</h2>
      <Grid>
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            <CoffeeCard coffee={coffee} onAdd={addItem} />
          </li>
        ))}
      </Grid>
    </Section>
  )
}
