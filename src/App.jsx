import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Grain } from './components/Decor'
import ScrollManager from './components/ScrollManager'
import PixelTracker from './components/PixelTracker'
import ProtectedRoute from './components/ProtectedRoute'
import DevPanel from './components/DevPanel'

// As três telas de marketing (alvos de anúncio) ficam no bundle inicial —
// carregam na hora, sem flash de loading pra quem cai da campanha.
import Landing from './pages/Landing'
import Sites from './pages/Sites'
import Motion from './pages/Motion'

// Loja + conta (checkout, QR de Pix, dashboard, login) só baixam quando o
// visitante entra no funil de compra. Isso tira ~muito peso do primeiro load.
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PackDetail = lazy(() => import('./pages/PackDetail'))
const Checkout = lazy(() => import('./pages/Checkout'))
const CheckoutReturn = lazy(() => import('./pages/CheckoutReturn'))

// Fallback discreto enquanto o chunk baixa — na identidade, sem susto.
function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink">
      <div
        aria-label="Carregando"
        className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-blood"
      />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Grain />
      <ScrollManager />
      <PixelTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Três telas focadas */}
          <Route path="/" element={<Landing />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/motion" element={<Motion />} />

          {/* Loja / conta */}
          <Route path="/login" element={<Login />} />
          <Route path="/pack/:id" element={<PackDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/compra/retorno" element={<CheckoutReturn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <DevPanel />
    </>
  )
}
