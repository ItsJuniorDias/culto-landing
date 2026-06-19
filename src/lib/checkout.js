// Fluxo de compra via Mercado Pago (links de pagamento).
//
// Como não existe servidor, guardamos no navegador qual pack está sendo
// comprado ANTES de mandar o usuário pro Mercado Pago. Quando ele volta pela
// back_url (/compra/retorno), a página de retorno lê esse dado + o status que
// o Mercado Pago adiciona na URL e libera o pack.

import { getPaymentLink } from '../data/payments'

const PENDING_KEY = 'culto:pendingPurchase'

// Inicia o checkout: lembra o pack e redireciona pro link do Mercado Pago.
// Retorna { ok, reason } — se reason === 'no-link', o link ainda não foi colado.
export function startCheckout(packId) {
  const link = getPaymentLink(packId)
  if (!link) return { ok: false, reason: 'no-link' }

  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ id: packId, at: Date.now() }))
  } catch {
    /* storage indisponível — segue mesmo assim */
  }

  // Mesma aba, pra que a back_url do Mercado Pago volte pro app e libere o pack.
  window.location.href = link
  return { ok: true }
}

// Registra o pack que está sendo comprado (usado tanto pelo redirect do
// Mercado Pago quanto pelo checkout interno mockado) antes de cair na página
// de retorno. Compartilha a mesma chave de armazenamento.
export function writePending(packId) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ id: packId, at: Date.now() }))
  } catch {
    /* storage indisponível — segue mesmo assim */
  }
}

export function readPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPending() {
  try {
    localStorage.removeItem(PENDING_KEY)
  } catch {
    /* ignore */
  }
}

// Lê o resultado que o Mercado Pago anexa na URL de retorno.
// Status possíveis do MP: approved | pending | in_process | rejected | failure
export function parseReturn(search = window.location.search) {
  const p = new URLSearchParams(search)
  const status = (p.get('status') || p.get('collection_status') || '').toLowerCase()
  const packFromUrl = p.get('pack') || p.get('external_reference') || ''
  const paymentId = p.get('payment_id') || p.get('collection_id') || ''
  return { status, packFromUrl, paymentId }
}

export function isApproved(status) {
  return status === 'approved' || status === 'success'
}

export function isPending(status) {
  return status === 'pending' || status === 'in_process'
}
