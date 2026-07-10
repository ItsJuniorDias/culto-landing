import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Logo from './Logo'
import Button from './Button'
import { useAuth } from '../context/AuthContext'
import { EASE } from '../lib/motion'
import { screens } from '../data/screens'

/*
 * Cabeçalho principal das três telas (Packs · Sites · Motion).
 * Cabeçalho principal das três telas (Packs / Sites / Motion). As três ofertas
 * são ROTAS. A aba ativa fica marcada em blood; a direita traz um CTA que muda
 * conforme a tela (comprar nos packs, orçamento nos serviços).
 *
 * Props:
 *   active   → 'packs' | 'sites' | 'motion' (marca a aba atual)
 *   cta      → { label, to?, href?, external? } botão primário da direita
 */

const tabBase =
  'font-util relative text-[13px] font-medium uppercase tracking-[0.14em] transition-colors'

export default function SiteHeader({ active, cta }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))
  const close = () => setOpen(false)

  // Renderiza o botão primário conforme o que a tela pediu.
  const renderCta = (extra = '') =>
    cta?.to ? (
      <Button to={cta.to} className={extra}>
        {cta.label}
      </Button>
    ) : (
      <Button
        href={cta?.href || '#'}
        target={cta?.external ? '_blank' : undefined}
        rel={cta?.external ? 'noopener noreferrer' : undefined}
        className={extra}
      >
        {cta?.label || 'Ver packs'}
      </Button>
    )

  return (
    <header
      className={`sticky top-0 z-[60] border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? 'border-line bg-ink/90' : 'border-line/60 bg-ink/70'
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-wrap items-center justify-between px-6">
        <Logo to="/" />

        {/* abas das três telas */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Telas">
          {screens.map((s) => {
            const isActive = s.key === active
            return (
              <NavLink
                key={s.key}
                to={s.to}
                className={`${tabBase} ${isActive ? 'text-bone' : 'text-ash hover:text-bone'}`}
              >
                {s.label}
                {/* marcador da aba ativa */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-[25px] left-0 h-[2px] w-full bg-blood transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-3.5">
          {user ? (
            <Button to="/dashboard" variant="ghost" className="hidden sm:inline-flex">
              Dashboard
            </Button>
          ) : (
            <Link
              to="/login"
              className="font-util hidden text-[13px] font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone sm:inline"
            >
              Entrar
            </Link>
          )}
          {renderCta('hidden sm:inline-flex')}

          <button
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="border border-line px-3 py-[9px] text-base text-bone md:hidden"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* dropdown mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-b border-line bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {screens.map((s) => {
                const isActive = s.key === active
                return (
                  <NavLink
                    key={s.key}
                    to={s.to}
                    onClick={close}
                    className={`flex items-center justify-between border-b border-line/70 py-3.5 ${
                      isActive ? 'text-bone' : 'text-ash'
                    }`}
                  >
                    <span className="font-util text-sm font-medium uppercase tracking-[0.14em]">
                      {s.label}
                    </span>
                    <span className="font-util text-[11px] normal-case tracking-[0.04em] text-faint">
                      {s.blurb}
                    </span>
                  </NavLink>
                )
              })}

              <div className="mt-4 flex flex-col gap-3">
                {renderCta('w-full')}
                {user ? (
                  <Button to="/dashboard" variant="ghost" full onClick={close}>
                    Dashboard
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    onClick={close}
                    className="font-util text-center text-[13px] font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
