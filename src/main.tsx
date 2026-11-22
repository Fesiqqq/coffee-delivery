import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { AppThemeProvider } from './contexts/AppThemeProvider'
import { CartProvider } from './contexts/CartProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppThemeProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
