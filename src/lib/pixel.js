// Wrapper fino do Meta Pixel (fbq).
//
// O carregador base + o `init` + o primeiro PageView ficam no index.html. Aqui
// a gente centraliza os eventos do funil pra usar um jeito só em toda a app,
// sem espalhar `window.fbq(...)` por dez arquivos.
//
// Tudo é à prova de bala: se o script do Pixel não carregou (adblock, dev sem
// rede, SSR), as chamadas viram no-op e NUNCA derrubam a página.

export const PIXEL_ID = '4131814847110778'

import { getOrCreateExternalId, newEventId, captureFbc } from './metaIdentity'

// Garante que o external_id existe e o _fbc do anúncio foi capturado assim que
// este módulo carrega — antes de qualquer evento do funil sair.
try {
  getOrCreateExternalId()
  captureFbc()
} catch {
  /* ambiente sem window (SSR/testes) */
}

function onlyDigits(v) {
  return String(v || '').replace(/\D+/g, '')
}

// Chama o fbq só se ele existir de verdade.
function fbq(...args) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq(...args)
  } catch {
    /* o pixel nunca pode quebrar a UI */
  }
}

// Evento padrão do Pixel. SEMPRE anexa um `eventID` — passado (determinístico,
// pra deduplicar com a Conversions API) ou gerado na hora. Devolve o eventID pra
// você reusar o MESMO id no evento server-side.
export function track(event, params = {}, options = {}) {
  const eventID = options.eventID || newEventId()
  fbq('track', event, params, { eventID })
  return eventID
}

// Evento custom (nomes fora da lista padrão do Meta).
export function trackCustom(event, params = {}, options = {}) {
  const eventID = options.eventID || newEventId()
  fbq('trackCustom', event, params, { eventID })
  return eventID
}

// ── Advanced Matching manual ────────────────────────────────────────────────
// Quando já sabemos e-mail/telefone (checkout, login), re-inicializar o Pixel
// com esses dados melhora MUITO o Event Match Quality. O próprio Pixel hasheia
// os valores no cliente (SHA-256) antes de enviar — nada crú sai daqui.
let lastIdentity = ''
export function identify({ email, phone, firstName, lastName } = {}) {
  const data = {}
  const em = (email || '').trim().toLowerCase()
  const ph = onlyDigits(phone)
  const fn = (firstName || '').trim().toLowerCase()
  const ln = (lastName || '').trim().toLowerCase()
  if (em) data.em = em
  if (ph) data.ph = ph
  if (fn) data.fn = fn
  if (ln) data.ln = ln

  // external_id estável entra SEMPRE — é o que mais segura o EMQ quando o resto
  // ainda não é conhecido, e não pode ser perdido no re-init do Pixel.
  const xid = getOrCreateExternalId()
  if (xid) data.external_id = xid

  const key = JSON.stringify(data)
  if (!Object.keys(data).length || key === lastIdentity) return // nada novo
  lastIdentity = key
  fbq('init', PIXEL_ID, data)
}

// Monta os parâmetros de produto a partir de um pack do catálogo. Inclui o
// `contents[]` (id/quantidade/preço unitário) além do `content_ids` — o Meta usa
// pra casar com catálogo e remarketing dinâmico (DPA).
export function packParams(pack, extra = {}) {
  if (!pack) return { currency: 'BRL', ...extra }
  const value = extra.value != null ? Number(extra.value) : Number(pack.priceValue) || 0
  const quantity = extra.num_items || 1
  return {
    content_ids: [pack.id],
    content_name: pack.title,
    content_type: 'product',
    content_category: pack.kind,
    contents: [{ id: pack.id, quantity, item_price: value }],
    value,
    currency: 'BRL',
    ...extra,
  }
}

// ── Helpers de funil (eventos padrão do Meta) ───────────────────────────────
// Todos repassam `options` (eventID) e devolvem o eventID usado, pra você
// espelhar o MESMO id no servidor (Conversions API) e deduplicar.
export const pageView = (options) => track('PageView', {}, options)
export const viewContent = (params, options) => track('ViewContent', params, options)
export const addToCart = (params, options) => track('AddToCart', params, options)
export const initiateCheckout = (params, options) => track('InitiateCheckout', params, options)
export const addPaymentInfo = (params, options) => track('AddPaymentInfo', params, options)
export const purchase = (params, options) => track('Purchase', params, options)
export const lead = (params, options) => track('Lead', params, options)
export const contact = (params, options) => track('Contact', params, options)
export const completeRegistration = (params, options) => track('CompleteRegistration', params, options)
export const search = (params, options) => track('Search', params, options)
