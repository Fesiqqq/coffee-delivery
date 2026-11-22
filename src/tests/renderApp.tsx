import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { AppThemeProvider } from '../contexts/AppThemeProvider'
import { CartProvider } from '../contexts/CartProvider'

/** Renderiza a aplicação inteira com os providers reais e espera as rotas lazy carregarem. */
export async function renderApp(route = '/') {
  const user = userEvent.setup()
  const utils = render(
    <MemoryRouter initialEntries={[route]}>
      <AppThemeProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppThemeProvider>
    </MemoryRouter>,
  )
  await waitFor(() => expect(screen.queryByText('Carregando…')).not.toBeInTheDocument())
  return { user, ...utils }
}
