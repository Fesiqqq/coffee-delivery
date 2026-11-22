import { CoffeeIcon, MoonStarsIcon, PackageIcon, TimerIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import heroCup from '../assets/coffees/latte.svg'
import symbolDark from '../assets/brand/logo-symbol-dark.svg'
import symbolLight from '../assets/brand/logo-symbol-light.svg'
import { useTheme } from '../hooks/useTheme'

const Section = styled.section`
  display: grid;
  gap: 2.5rem;
  align-items: center;
  padding-block: clamp(2rem, 7vw, 5.5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1.15fr 1fr;
    gap: 3.5rem;
  }

  h1 {
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 800;
    line-height: 1.2;
  }

  > div > p {
    margin-top: 1rem;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: ${({ theme }) => theme.colors.text};
  }
`

const Highlights = styled.ul`
  list-style: none;
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`

const Bullet = styled.span<{ $tone: 'brandStrong' | 'brand' | 'text' | 'accent' }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme, $tone }) => theme.colors[$tone]};
  color: ${({ theme }) => theme.colors.background};
`

const Art = styled.div`
  position: relative;
  justify-self: center;
  width: min(100%, 260px);
  aspect-ratio: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: min(100%, 420px);
  }

  .halo {
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, ${({ theme }) => theme.colors.brandSoft}, ${({ theme }) => theme.colors.accentSoft});
    filter: blur(2px);
  }

  .cup {
    position: absolute;
    inset: 14%;
    width: 72%;
    height: 72%;
  }

  .mark {
    position: absolute;
    right: 2%;
    top: 0;
    width: 30%;
    height: 30%;
  }
`

const highlights: { icon: ReactNode; tone: 'brandStrong' | 'brand' | 'text' | 'accent'; text: string }[] = [
  { icon: <MoonStarsIcon size={16} weight="fill" aria-hidden />, tone: 'accent', text: 'Do dia à madrugada' },
  { icon: <PackageIcon size={16} weight="fill" aria-hidden />, tone: 'text', text: 'Embalagem que mantém o café intacto' },
  { icon: <TimerIcon size={16} weight="fill" aria-hidden />, tone: 'brand', text: 'Entrega rápida e rastreada' },
  { icon: <CoffeeIcon size={16} weight="fill" aria-hidden />, tone: 'brandStrong', text: 'O café chega fresquinho até você' },
]

export function Hero() {
  const { mode } = useTheme()
  return (
    <Section aria-labelledby="hero-titulo">
      <div>
        <h1 id="hero-titulo">Encontre o café perfeito para qualquer hora do dia — ou da noite</h1>
        <p>Com o Café Lua você recebe seu café onde estiver, a qualquer hora.</p>
        <Highlights>
          {highlights.map((item) => (
            <li key={item.text}>
              <Bullet $tone={item.tone}>{item.icon}</Bullet>
              {item.text}
            </li>
          ))}
        </Highlights>
      </div>
      <Art aria-hidden>
        <span className="halo" />
        <img className="cup" src={heroCup} alt="" />
        <img className="mark" src={mode === 'dark' ? symbolDark : symbolLight} alt="" />
      </Art>
    </Section>
  )
}
