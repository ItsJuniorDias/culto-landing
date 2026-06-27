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

// ── Detalhes do pagamento (Pix/boleto) pra exibir na página de retorno ──
// O backend devolve o copia-e-cola/QR no POST de criação da sessão; guardamos
// por orderId pra a página de retorno mostrar enquanto o pagamento não confirma.
export function writePendingPayment(orderId, payment) {
  if (!orderId || !payment) return
  try {
    localStorage.setItem(`culto:payment:${orderId}`, JSON.stringify(payment))
  } catch {
    /* storage indisponível — segue mesmo assim */
  }
}

export function readPendingPayment(orderId) {
  if (!orderId) return null
  try {
    const raw = localStorage.getItem(`culto:payment:${orderId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPendingPayment(orderId) {
  if (!orderId) return
  try {
    localStorage.removeItem(`culto:payment:${orderId}`)
  } catch {
    /* ignore */
  }
}

// Lê o resultado anexado na URL de retorno.
// Fluxo novo (nossa API): só vem ?order=<id> — o status REAL é consultado no
// servidor pela página de retorno (não confiamos no status da URL).
// Fluxo legado (Mercado Pago): status/collection_status + pack/external_reference.
export function parseReturn(search = window.location.search) {
  const p = new URLSearchParams(search)
  const orderId = p.get('order') || ''
  const status = (p.get('status') || p.get('collection_status') || '').toLowerCase()
  const packFromUrl = p.get('pack') || p.get('external_reference') || ''
  const paymentId = p.get('payment_id') || p.get('collection_id') || ''
  return { orderId, status, packFromUrl, paymentId }
}

export function isApproved(status) {
  return status === 'approved' || status === 'success'
}

export function isPending(status) {
  return status === 'pending' || status === 'in_process'
}
