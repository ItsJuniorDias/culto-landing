import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { pageView } from '../lib/pixel'
import { captureFbc, getOrCreateExternalId } from '../lib/metaIdentity'
import { fireLead, fireContact, resolveService } from '../lib/leads'

/*
 * Cola o Meta Pixel no ciclo de vida do SPA. Montado uma vez no App.
 *
 *  1. Identidade/atribuição: na montagem, garante o external_id estável e
 *     captura o fbclid do anúncio → _fbc persistente. (O index.html já faz isso
 *     antes do 1º PageView; aqui é o cinto-e-suspensório, idempotente.)
 *
 *  2. PageView em cada troca de rota. O primeiro PageView (carga dura) já sai do
 *     index.html, então a gente pula a primeira renderização pra não contar a
 *     home duas vezes.
 *
 *  3. Lead + Contact automáticos: UM listener no documento pega QUALQUER clique
 *     num link de WhatsApp (wa.me / api.whatsapp.com) ou telefone (tel:). Nesse
 *     site, todo clique de WhatsApp é intenção de orçamento — então WhatsApp
 *     dispara Lead (com valor, deduplicado por serviço na sessão) + Contact, e
 *     telefone dispara Contact. Assim TODO CTA — cabeçalho, herói, cards de
 *     plano, barra mobile, dashboard — é rastreado sem instrumentar botão a botão
 *     e sem contar Contact duas vezes.
 */

const WHATSAPP_HOSTS = ['wa.me', 'api.whatsapp.com', 'whatsapp.com/send']

function classify(href = '') {
  const h = href.toLowerCase()
  if (h.startsWith('tel:')) return 'phone'
  if (WHATSAPP_HOSTS.some((d) => h.includes(d))) return 'whatsapp'
  return null
}

export default function PixelTracker() {
  const { pathname, search } = useLocation()
  const firstRender = useRef(true)

  // Identidade + atribuição, uma vez.
  useEffect(() => {
    getOrCreateExternalId()
    captureFbc()
  }, [])

  // PageView por navegação (a primeira carga já foi contada no index.html).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    pageView()
  }, [pathname, search])

  // Lead/Contact em qualquer clique de WhatsApp ou telefone.
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target?.closest?.('a[href]')
      if (!link) return
      // permite marcar um link pra NÃO virar lead/contact (ex.: suporte futuro)
      if (link.dataset?.noTrack != null) return
      const href = link.getAttribute('href') || ''
      const kind = classify(href)
      if (!kind) return

      if (kind === 'whatsapp') {
        const service = resolveService({ href, pathname: window.location.pathname })
        fireLead({ service }) // deduplicado por serviço/sessão lá dentro
        fireContact({ method: 'whatsapp', service })
      } else {
        fireContact({ method: 'phone' })
      }
    }
    // fase de captura: pega o clique mesmo se algo chamar stopPropagation.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
