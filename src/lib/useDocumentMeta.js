import { useEffect } from 'react'

// Ajusta <title> e a meta description por rota. Como é SPA (sem SSR), o Google
// renderiza o JS e enxerga esses valores; e ao voltar/avançar no histórico o
// título fica correto. Restaura o valor anterior ao desmontar pra não "vazar"
// o título de uma página pra outra.
//
// Uso: useDocumentMeta({ title, description })
export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    let metaEl = document.querySelector('meta[name="description"]')
    const prevDesc = metaEl?.getAttribute('content') || ''

    if (title) document.title = title
    if (description) {
      if (!metaEl) {
        metaEl = document.createElement('meta')
        metaEl.setAttribute('name', 'description')
        document.head.appendChild(metaEl)
      }
      metaEl.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (metaEl && prevDesc) metaEl.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
