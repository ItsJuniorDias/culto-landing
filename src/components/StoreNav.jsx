import { Link } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

/* Cabeçalho enxuto para páginas internas (detalhe do pack / retorno da compra). */
export default function StoreNav() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-[60] border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-wrap items-center justify-between px-6">
        <Logo to="/" />

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/#packs"
            className="font-util hidden text-[13px] font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone sm:inline"
          >
            Catálogo
          </Link>
          {user ? (
            <Button to="/dashboard">Dashboard</Button>
          ) : (
            <Button to="/login" variant="ghost">
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
