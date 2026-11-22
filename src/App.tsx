import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLayout } from './components/PageLayout'
import { Home } from './pages/Home'

// Checkout (React Hook Form + Zod) e Sucesso só são baixados quando acessados (RNF-03).
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const Success = lazy(() => import('./pages/Success').then((m) => ({ default: m.Success })))

/** Apenas rotas (RF-07). Regras ficam em reducers, utils, schemas e hooks. */
export function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
