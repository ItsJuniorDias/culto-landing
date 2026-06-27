// Estado da compra no navegador, entre o checkout e a página de retorno.
//
// Fluxo atual (nossa API + PradaPay): ao criar a sessão de checkout guardamos
// (1) qual pack está sendo comprado e (2) os dados de pagamento que só vêm na
// resposta de criação (QR/copia-e-cola do Pix, boleto) — porque o GET de status
// devolve só o status, não esses detalhes. Assim a página de retorno consegue
// exibir o Pix/boleto mesmo após um refresh, e faz polling até confirmar.
//
// O fluxo legado (links do Mercado Pago) ainda é tolerado no parseReturn, mas
// não é mais o caminho principal.

import { getPaymentLink } from '../data/payments'

const PENDING_KEY = 'culto:pendingPurchase'
const PAYMENT_KEY = 'culto:payment' // + ':<orderId>'

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

// ── Detalhes do pagamento (Pix/boleto) por pedido ───────────────────────────
// Só vêm na resposta de criação da sessão; guardamos por orderId pra a página
// de retorno reexibir o QR/linha mesmo após refresh (o GET de status não os traz).
export function writePayment(orderId, payment) {
  if (!orderId || !payment) return
  try {
    localStorage.setItem(`${PAYMENT_KEY}:${orderId}`, JSON.stringify(payment))
  } catch {
    /* storage indisponível — a página de retorno cai no estado sem detalhes */
  }
}

export function readPayment(orderId) {
  if (!orderId) return null
  try {
    const raw = localStorage.getItem(`${PAYMENT_KEY}:${orderId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPayment(orderId) {
  if (!orderId) return
  try {
    localStorage.removeItem(`${PAYMENT_KEY}:${orderId}`)
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
