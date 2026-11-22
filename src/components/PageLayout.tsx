import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from './Header'

const SkipLink = styled.a`
  position: absolute;
  left: 1rem;
  top: -100px;
  z-index: 100;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentStrong};
  color: ${({ theme }) => theme.colors.onAccent};
  font-weight: 700;

  &:focus {
    top: 1rem;
  }
`

const Main = styled.main`
  padding-bottom: 4rem;

  &:focus {
    outline: none;
  }
`

const Loading = styled.p`
  padding: 4rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Footer = styled.footer`
  padding: 1.5rem 1rem 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export function PageLayout() {
  const { pathname } = useLocation()

  // Ao trocar de rota, volta ao topo (comportamento esperado de uma navegação).
  useEffect(() => {
    window.scrollTo?.(0, 0)
  }, [pathname])

  return (
    <>
      <SkipLink href="#conteudo">Pular para o conteúdo</SkipLink>
      <Header />
      <Main id="conteudo" tabIndex={-1}>
        <Suspense fallback={<Loading role="status">Carregando…</Loading>}>
          <Outlet />
        </Suspense>
      </Main>
      <Footer>
        Café Lua · projeto acadêmico baseado no desafio Coffee Delivery · pedidos e pagamentos são fictícios
      </Footer>
    </>
  )
}
