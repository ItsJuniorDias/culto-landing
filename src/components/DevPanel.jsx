import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useDevMode } from '../context/DevModeContext'
import { useLocalStorage } from '../lib/useLocalStorage'
import { catalog } from '../data/catalog'

/*
 * Painel de desenvolvedor (canto inferior direito).
 *
 * Visibilidade:
 *  - Em desenvolvimento (`npm run dev`) aparece sempre.
 *  - No site publicado fica ESCONDIDO do cliente. Para abrir, acesse a página
 *    com  ?dev=1  na URL (fica salvo). Para esconder de novo, use  ?dev=0.
 *
 * Com o "Modo desenvolvedor" ligado, as páginas dos packs ganham um botão de
 * "simular compra" que libera o download sem pagamento — só para testar.
 */
function Switch({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-6 w-11 flex-none border transition-colors ${
        on ? 'border-blood bg-blood/30' : 'border-line bg-ink'
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-all ${
          on ? 'left-[24px] bg-blood' : 'left-[3px] bg-faint'
        }`}
      />
    </button>
  )
}

export default function DevPanel() {
  const { devMode, setDevMode } = useDevMode()
  const { user, owned, ownsPack, purchase, revoke, resetLibrary } = useAuth()
  const [armed, setArmed] = useLocalStorage('culto:devpanel', false)
  const [open, setOpen] = useState(false)

  // Lê ?dev=1 / ?dev=0 da URL para ligar/desligar a visibilidade no site publicado.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('dev')
    if (v === '1') setArmed(true)
    else if (v === '0') setArmed(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const show = import.meta.env.DEV || armed
  if (!show) return null

  const ownedSet = new Set(owned || [])

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="devpanel"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[300px] max-w-[calc(100vw-2rem)] border border-blood/50 bg-panel/95 shadow-featured backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-util text-[11px] font-bold uppercase tracking-[0.2em] text-blood-2">
                {'{ }'} Modo dev
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar painel"
                className="text-faint transition-colors hover:text-bone"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {/* toggle principal */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-util text-[12px] font-semibold uppercase tracking-[0.14em] text-bone">
                    Simular compras
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-faint">
                    Mostra o botão de desbloquear nos packs.
                  </p>
                </div>
                <Switch on={devMode} onClick={() => setDevMode((v) => !v)} label="Modo desenvolvedor" />
              </div>

              {devMode && (
                <div className="mt-4 border-t border-line pt-4">
                  {user ? (
                    <>
                      <div className="font-util mb-2 text-[10px] uppercase tracking-[0.18em] text-faint">
                        Packs · {user.email}
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {catalog.map((p) => {
                          const isFree = !!p.free
                          const has = isFree || ownedSet.has(p.id) || ownsPack(p.id)
                          return (
                            <li key={p.id} className="flex items-center justify-between gap-2">
                              <span className="truncate text-[12px] text-ash">{p.title}</span>
                              {isFree ? (
                                <span className="font-util flex-none text-[10px] uppercase tracking-[0.12em] text-faint">
                                  grátis
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => (has ? revoke(p.id) : purchase(p.id))}
                                  className={`font-util flex-none border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                                    has
                                      ? 'border-blood/60 bg-blood/15 text-bone hover:bg-blood/25'
                                      : 'border-line text-ash hover:border-blood hover:text-blood'
                                  }`}
                                >
                                  {has ? 'Liberado' : 'Bloqueado'}
                                </button>
                              )}
                            </li>
                          )
                        })}
                      </ul>

                      <button
                        type="button"
                        onClick={resetLibrary}
                        className="font-util mt-3 w-full border border-line px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint transition-colors hover:border-blood hover:text-blood"
                      >
                        Resetar biblioteca
                      </button>
                    </>
                  ) : (
                    <div>
                      <p className="text-[12px] text-ash">Entre numa conta para liberar ou bloquear packs.</p>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="font-util mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-blood transition-colors hover:text-blood-2"
                      >
                        Entrar →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-4 border-t border-line pt-3 text-[10px] leading-snug text-faint">
                Só para testes. No site publicado, abra com{' '}
                <code className="text-ash">?dev=1</code> e esconda com{' '}
                <code className="text-ash">?dev=0</code>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-util inline-flex items-center gap-2 border border-blood/50 bg-ink/90 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-bone shadow-glow-sm backdrop-blur-md transition-colors hover:border-blood"
      >
        <span
          aria-hidden="true"
          className={`h-2 w-2 ${devMode ? 'bg-blood shadow-glow-sm' : 'bg-faint'}`}
        />
        Dev
      </button>
    </div>
  )
}
