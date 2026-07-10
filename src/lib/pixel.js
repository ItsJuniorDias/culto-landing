// Wrapper fino do Meta Pixel (fbq).
//
// O carregador base + o `init` + o primeiro PageView ficam no index.html. Aqui
// a gente centraliza os eventos do funil pra usar um jeito só em toda a app,
// sem espalhar `window.fbq(...)` por dez arquivos.
//
// Tudo é à prova de bala: se o script do Pixel não carregou (adblock, dev sem
// rede, SSR), as chamadas viram no-op e NUNCA derrubam a página.

export const PIXEL_ID = '4131814847110778'

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

// Evento padrão do Pixel. `options.eventID` permite deduplicar com a Conversions
// API (mesmo evento vindo do browser e do servidor conta uma vez só).
export function track(event, params = {}, options) {
  if (options?.eventID) fbq('track', event, params, { eventID: options.eventID })
  else fbq('track', event, params)
}

// Evento custom (nomes fora da lista padrão do Meta).
export function trackCustom(event, params = {}, options) {
  if (options?.eventID) fbq('trackCustom', event, params, { eventID: options.eventID })
  else fbq('trackCustom', event, params)
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

  const key = JSON.stringify(data)
  if (!Object.keys(data).length || key === lastIdentity) return // nada novo
  lastIdentity = key
  fbq('init', PIXEL_ID, data)
}

// Monta os parâmetros de produto a partir de um pack do catálogo.
export function packParams(pack, extra = {}) {
  if (!pack) return { currency: 'BRL', ...extra }
  return {
    content_ids: [pack.id],
    content_name: pack.title,
    content_type: 'product',
    content_category: pack.kind,
    value: Number(pack.priceValue) || 0,
    currency: 'BRL',
    ...extra,
  }
}

// ── Helpers de funil (eventos padrão do Meta) ───────────────────────────────
export const pageView = () => track('PageView')
export const viewContent = (params) => track('ViewContent', params)
export const addToCart = (params) => track('AddToCart', params)
export const initiateCheckout = (params) => track('InitiateCheckout', params)
export const addPaymentInfo = (params) => track('AddPaymentInfo', params)
export const purchase = (params, options) => track('Purchase', params, options)
export const lead = (params) => track('Lead', params)
export const contact = (params) => track('Contact', params)
export const completeRegistration = (params) => track('CompleteRegistration', params)
export const search = (params) => track('Search', params)
