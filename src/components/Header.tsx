import { MapPinIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CartBadge } from './CartBadge'
import { Container } from './Container'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(8px);
`

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: ${({ theme }) => theme.layout.headerHeight};
`

const HomeLink = styled(Link)`
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Location = styled.span`
  display: none;
  align-items: center;
  gap: 0.25rem;
  height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentStrong};
  font-size: 0.875rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: inline-flex;
  }
`

export function Header() {
  return (
    <Bar>
      <Inner>
        <HomeLink to="/" aria-label="Café Lua — página inicial">
          <Logo />
        </HomeLink>
        <Actions>
          <Location>
            <MapPinIcon size={20} weight="fill" aria-hidden />
            Entregamos em todo o Brasil
          </Location>
          <ThemeToggle />
          <CartBadge />
        </Actions>
      </Inner>
    </Bar>
  )
}
