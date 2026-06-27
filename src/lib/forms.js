// Máscaras de input e validações para o checkout.
// Tudo client-side e "de mentira" no sentido de que nada é cobrado — mas as
// regras (Luhn, validade, CPF, bandeira) são reais, pra UX parecer um checkout
// de verdade enquanto os dados ficam mockados.

export const onlyDigits = (s) => (s || '').replace(/\D/g, '')

// ── Bandeira do cartão ──────────────────────────────────────────────────────
// Foco no que circula no Brasil. Retorna a chave ou null.
export function detectBrand(value) {
  const n = onlyDigits(value)
  if (!n) return null
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|5090|6277|6362|6363|650|6516|6550)/.test(n)) return 'elo'
  if (/^(606282|3841)/.test(n)) return 'hipercard'
  return null
}

const BRAND_LABEL = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  elo: 'Elo',
  hipercard: 'Hipercard',
}
export const brandLabel = (brand) => BRAND_LABEL[brand] || ''

// Amex usa 15 dígitos (grupos 4-6-5) e CVV de 4. Os demais, 16 dígitos e CVV 3.
export const cardMaxDigits = (brand) => (brand === 'amex' ? 15 : 16)
export const cvcLength = (brand) => (brand === 'amex' ? 4 : 3)

// ── Máscaras ────────────────────────────────────────────────────────────────
export function maskCardNumber(value, brand) {
  const n = onlyDigits(value).slice(0, cardMaxDigits(brand))
  if (brand === 'amex') {
    const a = n.slice(0, 4)
    const b = n.slice(4, 10)
    const c = n.slice(10, 15)
    return [a, b, c].filter(Boolean).join(' ')
  }
  return n.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function maskExpiry(value) {
  const n = onlyDigits(value).slice(0, 4)
  if (n.length <= 2) return n
  return `${n.slice(0, 2)}/${n.slice(2)}`
}

export function maskCPF(value) {
  const n = onlyDigits(value).slice(0, 11)
  return n
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

// Telefone BR com DDD. Fixo (10 dígitos): (11) 1234-5678.
// Celular (11 dígitos): (11) 91234-5678. A PradaPay exige o telefone.
export function maskPhone(value) {
  const n = onlyDigits(value).slice(0, 11)
  if (n.length <= 2) return n.replace(/(\d{1,2})/, '($1')
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
}

// ── Validações ──────────────────────────────────────────────────────────────
export function luhnValid(value) {
  const n = onlyDigits(value)
  if (n.length < 13) return false
  let sum = 0
  let double = false
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10)
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

export function cardNumberValid(value, brand) {
  const n = onlyDigits(value)
  const expected = cardMaxDigits(brand)
  return n.length === expected && luhnValid(n)
}

export function expiryValid(value) {
  const n = onlyDigits(value)
  if (n.length !== 4) return false
  const mm = parseInt(n.slice(0, 2), 10)
  const yy = parseInt(n.slice(2), 10)
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const curYY = now.getFullYear() % 100
  const curMM = now.getMonth() + 1
  if (yy < curYY || yy > curYY + 20) return false
  if (yy === curYY && mm < curMM) return false
  return true
}

export const cvcValid = (value, brand) => onlyDigits(value).length === cvcLength(brand)

export const nameValid = (value) => (value || '').trim().split(/\s+/).filter(Boolean).length >= 2

export const emailValid = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((value || '').trim())

// DDD (2) + número (8 fixo ou 9 celular) = 10 ou 11 dígitos.
export const phoneValid = (value) => {
  const n = onlyDigits(value)
  return n.length === 10 || n.length === 11
}

export function cpfValid(value) {
  const n = onlyDigits(value)
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false
  const check = (slice, factor) => {
    let sum = 0
    for (let i = 0; i < slice; i++) sum += parseInt(n[i], 10) * (factor - i)
    const d = 11 - (sum % 11)
    return d >= 10 ? 0 : d
  }
  return check(9, 10) === parseInt(n[9], 10) && check(10, 11) === parseInt(n[10], 10)
}
