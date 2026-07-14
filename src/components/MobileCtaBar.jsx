import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { waUrl, buildQuoteMessage } from '../lib/leads'

/*
 * Barra de ação fixa no rodapé — SÓ no mobile.
 *
 * POR QUE EXISTE: o CTA do cabeçalho fica escondido no celular (hidden sm:...),
 * então, no aparelho onde quase todo o tráfego de anúncio cai, a única forma de
 * converter era rolar até uma seção de CTA ou abrir o menu-sanduíche. Essa barra
 * mantém a ação principal sempre à mão.
 *
 * Ela aparece depois que o herói sai da tela (pra não competir com o CTA do
 * próprio herói) E some quando o visitante chega no rodapé — senão a barra fixa
 * cobriria o formulário de orçamento / botão de compra que fica lá embaixo.
 *
 * Variantes:
 *   'packs'  → "Ver os packs" rola até os planos + âncora de preço
 *   'sites'  → "Chamar no WhatsApp" (dispara Lead) + "Planos"
 *   'motion' → idem, no número do motion
 */
export default function MobileCtaBar({ variant = 'packs', showAfter = 560, hideNearBottomPx = 440 }) {
  const [pastHero, setPastHero] = useState(false)
  const [nearBottom, setNearBottom] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setPastHero(y > showAfter)
    // Distância do fundo do viewport até o fim do documento.
    const docH = document.documentElement.scrollHeight
    const bottomGap = docH - (y + window.innerHeight)
    setNearBottom(bottomGap < hideNearBottomPx)
  })

  // Recalcula ao montar (páginas curtas podem já estar no fundo).
  useEffect(() => {
    const y = window.scrollY
    const docH = document.documentElement.scrollHeight
    setNearBottom(docH - (y + window.innerHeight) < hideNearBottomPx)
  }, [hideNearBottomPx])

  const visible = pastHero && !nearBottom
  const isService = variant === 'sites' || variant === 'motion'

  const whatsHref = isService ? waUrl(buildQuoteMessage({ service: variant }), variant) : '#'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-ink/95 backdrop-blur-md md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {isService ? (
              <>
                <a
                  href="#planos"
                  className="font-util flex-none border border-line px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:border-blood"
                >
                  Planos
                </a>
                <a
                  href={whatsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-util flex flex-1 items-center justify-center gap-2 border border-transparent bg-blood px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:bg-blood-2"
                >
                  Chamar no WhatsApp ↗
                </a>
              </>
            ) : (
              <>
                <div className="flex-1 leading-tight">
                  <div className="font-util text-[10px] uppercase tracking-[0.14em] text-faint">
                    A partir de
                  </div>
                  <div className="font-display text-[20px] font-black leading-none text-bone">
                    R$ 197
                  </div>
                </div>
                <a
                  href="#packs"
                  className="font-util flex items-center justify-center gap-2 border border-transparent bg-blood px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:bg-blood-2"
                >
                  Ver os packs ↗
                </a>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
