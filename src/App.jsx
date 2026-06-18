import { Routes, Route, Navigate } from 'react-router-dom'
import { Grain } from './components/Decor'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PackDetail from './pages/PackDetail'
import CheckoutReturn from './pages/CheckoutReturn'
import ProtectedRoute from './components/ProtectedRoute'
import DevPanel from './components/DevPanel'

export default function App() {
  return (
    <>
      <Grain />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pack/:id" element={<PackDetail />} />
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
