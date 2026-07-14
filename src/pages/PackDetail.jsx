import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import StoreNav from '../components/StoreNav'
import Footer from '../components/Footer'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import PosterTile from '../components/PosterTile'
import { Halftone } from '../components/Decor'
import { useAuth } from '../context/AuthContext'
import { useDevMode } from '../context/DevModeContext'
import { byId } from '../data/catalog'
import { downloadFile } from '../lib/download'
import { viewContent, addToCart, packParams } from '../lib/pixel'
import { EASE } from '../lib/motion'

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="mt-[3px] h-[17px] w-[17px] flex-none fill-none stroke-blood"
    strokeWidth="2.6"
  >
    <path d="M4 12l5 5L20 6" />
  </svg>
)

const Lock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="4.5" y="10.5" width="15" height="10" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
)

function Gallery({ pack }) {
  const [active, setActive] = useState(0)
  const imgs = pack.gallery || []

  if (!imgs.length) {
    // Sem fotos: cartaz on-brand com o nome e o formato do pack.
    return (
      <div className="aspect-[4/5] w-full overflow-hidden border border-line">
        <PosterTile title={pack.title.split('—').pop().trim()} format={pack.format} />
      </div>
    )
  }

  return (
    <div>
      <div className="grid place-items-center overflow-hidden border border-line bg-pit p-3 sm:p-4">
        <img
          src={imgs[active]}
          alt={`${pack.title} — preview ${active + 1}`}
          className="max-h-[60vh] w-auto object-contain"
        />
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {imgs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={`aspect-[3/4] overflow-hidden border transition-colors ${
                i === active ? 'border-blood' : 'border-line hover:border-ash'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { user, ownsPack, purchase, revoke, recordDownload, downloads } = useAuth()
  const { devMode } = useDevMode()

  const pack = byId(id)

  useEffect(() => {
    window.scrollTo(0, 0)
    const p = byId(id)
    if (p) viewContent(packParams(p))
  }, [id])

  if (!pack) return <Navigate to="/" replace />

  const free = !!pack.free
  const owned = ownsPack(pack.id)
  const count = downloads[pack.id] || 0

  const handleDownload = () => {
    downloadFile(pack.file, pack.fileName)
    recordDownload(pack.id)
  }

  const handleBuy = () => {
    addToCart(packParams(pack))
    // Checkout como convidado: nada de parede de login antes de comprar. O
    // e-mail é coletado no próprio checkout e o link de download vai por e-mail.
    // Forçar cadastro aqui era o maior ralo de conversão da loja.
    navigate(`/checkout/${pack.id}`)
  }

  return (
    <>
      <StoreNav />

      <main className="relative overflow-hidden">
        <Halftone className="opacity-[0.5]" />

        <div className="relative mx-auto max-w-wrap px-6 pb-20 pt-10 sm:pt-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-util mb-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-bone"
          >
            ← Voltar
          </button>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-12"
          >
            {/* visual */}
            <div>
              <Gallery pack={pack} />
            </div>

            {/* info + ação */}
            <div className="flex flex-col">
              <Eyebrow solo>{pack.kind}</Eyebrow>
              <h1 className="font-display mt-3 text-[40px] font-black leading-[0.92] sm:text-[52px]">
                {pack.title}
              </h1>
              <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-ash">{pack.long}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {pack.badges.map((b) => (
                  <span
                    key={b}
                    className="font-util border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ash"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* specs */}
              <div className="font-util mt-6 grid grid-cols-3 gap-4 border-y border-line py-5">
                <div>
                  <div className="font-display text-lg font-extrabold leading-none">{pack.format}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-faint">formato</div>
                </div>
                <div>
                  <div className="font-display text-lg font-extrabold leading-none">{pack.spec}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-faint">conteúdo</div>
                </div>
                <div>
                  <div className="font-display text-lg font-extrabold leading-none">{pack.size}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-faint">tamanho</div>
                </div>
              </div>

              {/* o que vem dentro */}
              {pack.includes?.length > 0 && (
                <div className="mt-6">
                  <span className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">
                    O que vem dentro
                  </span>
                  <ul className="mt-3 flex flex-col gap-[11px]">
                    {pack.includes.map((f) => (
                      <li key={f} className="flex gap-[11px] text-[14.5px] text-bone">
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ─── BLOCO DE AÇÃO ─── */}
              <div className="mt-7 border border-line bg-panel p-6 sm:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="font-display text-[40px] font-black leading-none">{pack.price}</div>
                    <div className="font-util mt-1.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                      {free ? 'liberado na sua conta' : 'pagamento único · acesso vitalício'}
                    </div>
                  </div>
                  {owned && !free && (
                    <span className="font-util bg-blood px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-bone">
                      Na biblioteca
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  {free || owned ? (
                    <>
                      <Button as="button" full onClick={handleDownload}>
                        Baixar pack ↓
                      </Button>
                      <p className="font-util mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-faint">
                        {count > 0
                          ? `${count} ${count === 1 ? 'download' : 'downloads'} · pronto pra baixar`
                          : 'Pronto pra baixar'}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* download bloqueado */}
                      <div className="flex items-center justify-center gap-2.5 border border-dashed border-line bg-ink/50 px-4 py-3.5 text-faint">
                        <Lock className="h-4 w-4" />
                        <span className="font-util text-[12px] font-semibold uppercase tracking-[0.16em]">
                          Download bloqueado
                        </span>
                      </div>

                      <Button as="button" full onClick={handleBuy} className="mt-3">
                        Comprar · {pack.price}
                      </Button>

                      <p className="font-util mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-faint">
                        Pagamento seguro · Pix, cartão ou boleto
                      </p>

                      {!user && (
                        <p className="font-util mt-2 text-center text-[10px] uppercase tracking-[0.14em] text-faint/70">
                          Você entra na conta antes de pagar
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* ─── modo desenvolvedor ─── */}
                {devMode && !free && (
                  <div className="mt-5 border border-dashed border-blood/50 bg-blood/[0.06] p-4">
                    <span className="font-util text-[10px] font-bold uppercase tracking-[0.2em] text-blood-2">
                      ⚙ Modo dev · teste de desbloqueio
                    </span>
                    {!user ? (
                      <p className="mt-2 text-[13px] text-ash">
                        Entre numa conta para simular a compra.
                      </p>
                    ) : owned ? (
                      <button
                        type="button"
                        onClick={() => revoke(pack.id)}
                        className="font-util mt-3 w-full border border-line px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
                      >
                        Bloquear de novo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => purchase(pack.id)}
                        className="font-util mt-3 w-full border border-blood bg-blood/15 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:bg-blood/25"
                      >
                        Simular compra (desbloquear)
                      </button>
                    )}
                    <p className="mt-2 text-[11px] text-faint">Desbloqueio de teste, sem pagamento.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
