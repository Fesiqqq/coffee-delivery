import { CoffeeCatalog } from '../components/CoffeeCatalog'
import { Container } from '../components/Container'
import { Hero } from '../components/Hero'
import { coffees } from '../data/coffees'

export function Home() {
  return (
    <Container>
      <Hero />
      <CoffeeCatalog coffees={coffees} />
    </Container>
  )
}
