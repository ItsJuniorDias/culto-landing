import { Routes, Route, Navigate } from 'react-router-dom'
import { Grain } from './components/Decor'
import ScrollManager from './components/ScrollManager'
import PixelTracker from './components/PixelTracker'
import Landing from './pages/Landing'
import Sites from './pages/Sites'
import Motion from './pages/Motion'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PackDetail from './pages/PackDetail'
import Checkout from './pages/Checkout'
import CheckoutReturn from './pages/CheckoutReturn'
import ProtectedRoute from './components/ProtectedRoute'
import DevPanel from './components/DevPanel'

export default function App() {
  return (
    <>
      <Grain />
      <ScrollManager />
      <PixelTracker />
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
      <DevPanel />
    </>
  )
}
