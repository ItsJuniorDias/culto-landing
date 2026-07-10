import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * Com múltiplas rotas, o React Router não rola a página sozinho. Este
 * componente:
 *   - rola pro topo ao trocar de rota (quando não há âncora), e
 *   - rola suave até o elemento da âncora quando a URL tem #hash
 *     (ex.: ir de /sites pra /#packs).
 * Respeita prefers-reduced-motion (sem animação de scroll).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (hash) {
      // espera o layout da nova rota montar antes de procurar o alvo
      const id = decodeURIComponent(hash.slice(1))
      const scrollToTarget = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }
      const t = window.setTimeout(scrollToTarget, 60)
      return () => window.clearTimeout(t)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
