// Identidade e atribuição do Meta (external_id + fbc/fbp + fonte do evento).
//
// POR QUE ISSO EXISTE: o Event Match Quality (EMQ) — o quanto o Meta consegue
// casar o evento com uma pessoa — sobe MUITO com um identificador estável. Como
// o checkout é sem login (convidado), a gente gera um `external_id` anônimo e
// persistente e injeta no Advanced Matching. Também captura o `fbclid` que vem
// no clique do anúncio e o transforma num `_fbc` estável no formato do Meta
// (o cookie que o Pixel cria sozinho SOME se a pessoa volta depois — o
// localStorage não), e lê o `_fbp`. Resultado: Pixel mais preciso HOJE e pronto
// pra Conversions API (server-side) DEPOIS, sem reescrever nada.
//
// À prova de bala: storage/cookie indisponível → devolve null, nunca quebra.

const XID_KEY = 'culto:xid'
const FBC_KEY = 'culto:_fbc'
const FBC_MAX_AGE_DAYS = 90 // janela de atribuição do fbclid

function ls() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function uuid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* sem crypto.randomUUID — cai no fallback */
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

// external_id anônimo e estável (mesmo aparelho/navegador). Vira Advanced Matching.
// O Pixel hasheia (SHA-256) no cliente antes de enviar — nada crú sai daqui.
export function getOrCreateExternalId() {
  const store = ls()
  if (!store) return null
  let id = store.getItem(XID_KEY)
  if (!id) {
    id = uuid()
    try {
      store.setItem(XID_KEY, id)
    } catch {
      /* storage cheio/privado — segue sem persistir */
    }
  }
  return id
}

export function readCookie(name) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return m ? decodeURIComponent(m.pop()) : null
}

function writeCookie(name, value, maxAgeDays = FBC_MAX_AGE_DAYS) {
  if (typeof document === 'undefined') return
  try {
    document.cookie = `${name}=${value};path=/;max-age=${maxAgeDays * 24 * 60 * 60};SameSite=Lax`
  } catch {
    /* cookie bloqueado */
  }
}

// Captura o fbclid do anúncio → monta o _fbc no formato do Meta
// (fb.1.<timestamp>.<fbclid>), persiste no localStorage E no cookie. Se a pessoa
// volta numa sessão nova SEM fbclid, re-hidrata o cookie a partir do localStorage
// pra não perder a atribuição. Roda uma vez no load. Devolve o _fbc atual.
export function captureFbc() {
  const store = ls()
  let fbc = readCookie('_fbc') || (store && store.getItem(FBC_KEY)) || null
  try {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid')
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`
      if (store) {
        try {
          store.setItem(FBC_KEY, fbc)
        } catch {
          /* sem persistência */
        }
      }
      writeCookie('_fbc', fbc)
    } else if (fbc && !readCookie('_fbc')) {
      // sessão nova sem fbclid → recoloca o cookie a partir do que guardamos
      writeCookie('_fbc', fbc)
    }
  } catch {
    /* URL/searchParams indisponível */
  }
  return fbc
}

export function getFbc() {
  const store = ls()
  return readCookie('_fbc') || (store && store.getItem(FBC_KEY)) || null
}

export function getFbp() {
  return readCookie('_fbp')
}

// Gera um eventID. Sem prefixo → único (uuid). Com prefixo estável (ex.: o id do
// pedido) → determinístico, pra o MESMO evento no browser e no servidor
// deduplicar na Conversions API. Ex.: newEventId('order') + o id.
export function newEventId(prefix) {
  const id = uuid()
  return prefix ? `${prefix}.${id}` : id
}

// Tudo que a Conversions API precisa receber junto do evento. Quando você ligar
// o CAPI, mande isto no `user_data` / `event_source_url` do payload server-side.
export function getEventSourceData() {
  return {
    external_id: getOrCreateExternalId(),
    fbc: getFbc(),
    fbp: getFbp(),
    event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
    client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  }
}

// Monta o corpo já no formato da Conversions API (espelho do evento do browser).
// `eventId` TEM que ser o mesmo id disparado no browser pra deduplicar. Os campos
// de PII (em/ph/fn/ln) você hasheia no SERVIDOR — não mande crú pela rede.
export function capiPayload({ eventName, eventId, customData = {}, userData = {} } = {}) {
  const src = getEventSourceData()
  return {
    event_name: eventName,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: src.event_source_url,
    user_data: {
      external_id: src.external_id,
      fbc: src.fbc,
      fbp: src.fbp,
      client_user_agent: src.client_user_agent,
      ...userData,
    },
    custom_data: customData,
  }
}
