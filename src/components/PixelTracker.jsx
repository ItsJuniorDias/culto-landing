import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { pageView, contact } from '../lib/pixel'

/*
 * Cola o Meta Pixel no ciclo de vida do SPA. Montado uma vez no App.
 *
 *  1. PageView em cada troca de rota. O primeiro PageView (carga dura) já sai
 *     do index.html, então aqui a gente pula a primeira renderização pra não
 *     contar duas vezes a home.
 *
 *  2. Contact automático: um único listener no documento pega QUALQUER clique
 *     num link de WhatsApp (wa.me / api.whatsapp.com) ou telefone (tel:) e
 *     dispara o evento Contact. Assim todo CTA de orçamento/contato do site
 *     — Sites, Motion, dashboard, hero, rodapé, o número novo — é rastreado
 *     sem precisar instrumentar cada botão na mão.
 */

const WHATSAPP_HOSTS = ['wa.me', 'api.whatsapp.com', 'whatsapp.com/send']

function classifyContact(href = '') {
  const h = href.toLowerCase()
  if (h.startsWith('tel:')) return 'phone'
  if (WHATSAPP_HOSTS.some((d) => h.includes(d))) return 'whatsapp'
  return null
}

export default function PixelTracker() {
  const { pathname, search } = useLocation()
  const firstRender = useRef(true)

  // PageView por navegação (a primeira carga já foi contada no index.html).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    pageView()
  }, [pathname, search])

  // Contact em qualquer clique num link de WhatsApp ou telefone.
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target?.closest?.('a[href]')
      if (!link) return
      const method = classifyContact(link.getAttribute('href') || '')
      if (!method) return
      contact({ contact_method: method, source_url: window.location.pathname })
    }
    // captura na fase de captura pra pegar o clique mesmo se algo der stopPropagation.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
