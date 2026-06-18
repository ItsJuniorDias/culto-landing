import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Logo from './Logo'
import Button from './Button'
import { navLinks } from '../data/content'
import { EASE } from '../lib/motion'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Deepen the bar's background once the hero starts to scroll away.
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))

  return (
    <header
      className={`sticky top-0 z-[60] border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? 'border-line bg-ink/90' : 'border-line/60 bg-ink/70'
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-wrap items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-util text-[13px] font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <Button href="#packs" className="hidden sm:inline-flex">
            Ver packs
          </Button>
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

      {/* Mobile dropdown */}
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
            <div className="flex flex-col gap-5 px-6 py-6">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-util text-sm font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
                >
                  {l.label}
                </a>
              ))}
              <Button href="#packs" full onClick={() => setOpen(false)}>
                Ver packs
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
