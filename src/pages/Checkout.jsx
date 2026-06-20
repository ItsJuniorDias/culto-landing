import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import StoreNav from '../components/StoreNav'
import Footer from '../components/Footer'
import Eyebrow from '../components/Eyebrow'
import Button from '../components/Button'
import { Halftone } from '../components/Decor'
import OrderSummary from '../components/checkout/OrderSummary'
import CheckoutInput from '../components/checkout/CheckoutInput'
import { Card, QrCode, Barcode, Lock, Shield, Check, Copy, Chevron, ArrowLeft, Spinner } from '../components/checkout/icons'
import { useAuth } from '../context/AuthContext'
import { byId } from '../data/catalog'
import { writePending } from '../lib/checkout'
import { api, ApiError, centsToReais } from '../lib/api'
import { formatBRL, installmentOptions } from '../lib/money'
import { EASE } from '../lib/motion'
import {
  onlyDigits,
  detectBrand,
  brandLabel,
  cvcLength,
  maskCardNumber,
  maskExpiry,
  maskCPF,
  cardNumberValid,
  expiryValid,
  cvcValid,
  nameValid,
  emailValid,
  cpfValid,
} from '../lib/forms'

// Os cupons agora são validados pela API (fonte da verdade). Veja applyCoupon.

// ── QR fake (não escaneável, só pra aparência) ──────────────────────────────
function seededRng(seed) {
  let s = 0
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function MockQR({ seed = 'culto', size = 25 }) {
  const cells = useMemo(() => {
    const rng = seededRng(seed)
    const inFinder = (x, y) =>
      (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)
    const out = []
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (!inFinder(x, y) && rng() > 0.52) out.push([x, y])
    return out
  }, [seed, size])

  const finder = (fx, fy) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" fill="#0E0D10" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#0E0D10" />
    </g>
  )

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="156" height="156" shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0E0D10" />
      ))}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  )
}

function MockBarcode({ seed = 'culto' }) {
  const bars = useMemo(() => {
    const rng = seededRng(seed)
    const out = []
    let x = 0
    while (x < 300) {
      const w = 1 + Math.floor(rng() * 3)
      out.push({ x, w, fill: rng() > 0.5 })
      x += w
    }
    return out
  }, [seed])

  return (
    <svg viewBox="0 0 300 64" className="h-[58px] w-full" preserveAspectRatio="none" shapeRendering="crispEdges">
      <rect width="300" height="64" fill="#fff" />
      {bars.map((b, i) => b.fill && <rect key={i} x={b.x} y="4" width={b.w} height="56" fill="#0E0D10" />)}
    </svg>
  )
}

function MethodTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 flex-col items-center gap-1.5 border px-2 py-3.5 transition-colors ${
        active
          ? 'border-blood bg-blood/10 text-bone'
          : 'border-line text-ash hover:border-faint hover:text-bone'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-util text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</span>
    </button>
  )
}

function SectionTitle({ n, children }) {
  return (
    <h2 className="font-util mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-bone">
      <span className="grid h-6 w-6 place-items-center border border-blood text-[11px] font-semibold text-blood">
        {n}
      </span>
      {children}
    </h2>
  )
}

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { user, ownsPack } = useAuth()
  const pack = byId(id)

  // ── Estado (todos os hooks antes de qualquer return) ──
  const [method, setMethod] = useState('card')
  const [email, setEmail] = useState(user?.email || '')
  const [cpf, setCpf] = useState('')
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '' })
  const [installments, setInstallments] = useState(1)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [copied, setCopied] = useState('')

  // cupom — validado e precificado pela API (centavos → reais para exibir)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null) // { code, label }
  const [serverPricing, setServerPricing] = useState(null) // PricingBreakdown da API
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // erro ao criar a sessão de checkout (ex.: API fora do ar)
  const [submitError, setSubmitError] = useState('')

  const subtotal = pack?.priceValue || 0
  const discount = serverPricing ? centsToReais(serverPricing.discountCents) : 0
  const total = serverPricing ? centsToReais(serverPricing.totalCents) : subtotal

  const brand = detectBrand(card.number)
  const installmentList = useMemo(() => installmentOptions(total), [total])
  const selN = Math.min(installments, installmentList.length)
  const selectedInstallment = installmentList[selN - 1]

  const errors = {
    email: emailValid(email) ? '' : 'E-mail inválido',
    cpf: cpfValid(cpf) ? '' : 'CPF inválido',
    number: cardNumberValid(card.number, brand) ? '' : 'Número do cartão inválido',
    name: nameValid(card.name) ? '' : 'Informe nome e sobrenome',
    exp: expiryValid(card.exp) ? '' : 'Validade inválida',
    cvc: cvcValid(card.cvc, brand) ? '' : 'CVV inválido',
  }
  const baseValid = !errors.email && !errors.cpf
  const isValid =
    method === 'card'
      ? baseValid && !errors.number && !errors.name && !errors.exp && !errors.cvc
      : baseValid

  // ── Guards ──
  if (!pack) return <Navigate to="/" replace />
  if (pack.free) return <Navigate to={`/pack/${pack.id}`} replace />
  if (!user) return <Navigate to="/login" state={{ from: `/checkout/${pack.id}` }} replace />
  if (ownsPack(pack.id)) return <Navigate to={`/pack/${pack.id}`} replace />

  // ── Handlers ──
  const blur = (f) => setTouched((t) => ({ ...t, [f]: true }))

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code || couponLoading) return
    setCouponLoading(true)
    setCouponError('')
    try {
      // A API valida o cupom contra o pack e devolve o preço já recalculado.
      const { pricing } = await api.validateCoupon({ packId: pack.id, code })
      setAppliedCoupon(pricing.coupon || { code, label: 'Cupom aplicado' })
      setServerPricing(pricing)
    } catch (err) {
      const msg =
        err instanceof ApiError && err.code === 'COUPON_INVALID'
          ? 'Cupom inválido ou expirado'
          : (err?.message ?? 'Não foi possível validar o cupom')
      setCouponError(msg)
      setAppliedCoupon(null)
      setServerPricing(null)
    } finally {
      setCouponLoading(false)
    }
  }
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setServerPricing(null)
    setCouponError('')
    setCouponInput('')
  }

  const copy = (text, which) => {
    try {
      navigator.clipboard?.writeText(text)
    } catch {
      /* clipboard indisponível */
    }
    setCopied(which)
    setTimeout(() => setCopied(''), 1800)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'processing') return

    const t = { email: true, cpf: true }
    if (method === 'card') Object.assign(t, { number: true, name: true, exp: true, cvc: true })
    setTouched(t)
    if (!isValid) return

    setStatus('processing')
    setSubmitError('')

    // Monta o payload pra API. O CPF vai só com dígitos; o preço NÃO é enviado
    // — o servidor recalcula a partir do pack + cupom (cliente não dita valor).
    const payload = {
      packId: pack.id,
      paymentMethod: method,
      customer: { email: email.trim(), cpf: onlyDigits(cpf) },
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
    }

    if (method === 'card') {
      // PCI: em produção o cartão é tokenizado pelo SDK do gateway e só o token
      // trafega. Aqui geramos um token de demonstração (o PAN cru não é enviado).
      const last4 = onlyDigits(card.number).slice(-4)
      payload.cardToken = `tok_mock_${last4 || '0000'}_${Date.now()}`
      payload.installments = selN
      if (nameValid(card.name)) payload.customer.name = card.name.trim()
    }

    try {
      const { order } = await api.createCheckoutSession(payload)
      // Guarda o pack como fallback de exibição na página de retorno.
      writePending(pack.id)
      // O status REAL é consultado no servidor pela página de retorno (via order id).
      navigate(`/compra/retorno?order=${order.id}`)
    } catch (err) {
      setStatus('idle')
      setSubmitError(err?.message ?? 'Não foi possível concluir o pagamento. Tente de novo.')
    }
  }

  // rótulos contextuais
  const payLabel =
    method === 'card'
      ? `Pagar ${formatBRL(total)}`
      : method === 'pix'
        ? 'Confirmar pagamento'
        : 'Gerar boleto'
  const installmentLabel =
    method === 'card'
      ? selectedInstallment?.label
      : method === 'pix'
        ? 'Pix à vista · aprovação na hora'
        : 'Boleto à vista · vence em 3 dias'

  const pixCode = `00020126580014br.gov.bcb.pix0136culto-${pack.id}-a1b2c3d4e5520400005303986540${total.toFixed(2)}5802BR5913CULTO ASSETS6009SAO PAULO62070503***6304E2CA`
  const boletoLine = `34191.790010 ${String(Math.round(total * 100)).padStart(5, '0').slice(0, 5)}.510047 91020.150008 8 ${Math.floor(Date.now() / 1e7)}`

  const summary = (
    <OrderSummary
      pack={pack}
      subtotal={subtotal}
      discount={discount}
      total={total}
      couponInput={couponInput}
      onCouponInputChange={setCouponInput}
      appliedCoupon={appliedCoupon}
      couponError={couponError}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
      installmentLabel={installmentLabel}
    />
  )

  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: EASE } }

  return (
    <>
      <StoreNav />

      <main className="relative overflow-hidden">
        <Halftone className="opacity-40" />

        <div className="relative z-[2] mx-auto max-w-wrap px-6 pb-24 pt-8 sm:pt-12">
          <Link
            to={`/pack/${pack.id}`}
            className="font-util inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-bone"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao pack
          </Link>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6"
          >
            <Eyebrow solo>Checkout seguro</Eyebrow>
            <h1 className="font-display mt-3 text-[44px] font-black leading-[0.9] sm:text-[54px]">
              Finalizar compra
            </h1>
          </motion.div>

          {/* resumo recolhível — mobile */}
          <div className="mt-7 lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="flex w-full items-center justify-between border border-line bg-panel px-4 py-3.5"
            >
              <span className="font-util text-[12px] uppercase tracking-[0.18em] text-ash">
                Resumo do pedido
              </span>
              <span className="flex items-center gap-2">
                <span className="font-display text-[20px] font-extrabold">{formatBRL(total)}</span>
                <Chevron className={`h-4 w-4 text-faint transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {summaryOpen && <div className="mt-3">{summary}</div>}
          </div>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_390px]">
            {/* ── formulário ── */}
            <form onSubmit={submit} className="min-w-0">
              {/* 01 — dados */}
              <section className="border border-line bg-panel p-6 sm:p-7">
                <SectionTitle n="01">Seus dados</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CheckoutInput
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    onBlur={() => blur('email')}
                    show={touched.email}
                    error={errors.email}
                    placeholder="voce@email.com"
                    autoComplete="email"
                    inputMode="email"
                    hint="recibo e acesso"
                  />
                  <CheckoutInput
                    label="CPF"
                    value={cpf}
                    onChange={(v) => setCpf(maskCPF(v))}
                    onBlur={() => blur('cpf')}
                    show={touched.cpf}
                    error={errors.cpf}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                  />
                </div>
              </section>

              {/* 02 — pagamento */}
              <section className="mt-5 border border-line bg-panel p-6 sm:p-7">
                <SectionTitle n="02">Pagamento</SectionTitle>

                <div className="flex gap-2.5">
                  <MethodTab active={method === 'card'} onClick={() => setMethod('card')} icon={Card} label="Cartão" />
                  <MethodTab active={method === 'pix'} onClick={() => setMethod('pix')} icon={QrCode} label="Pix" />
                  <MethodTab active={method === 'boleto'} onClick={() => setMethod('boleto')} icon={Barcode} label="Boleto" />
                </div>

                {/* cartão */}
                {method === 'card' && (
                  <motion.div {...fade} className="mt-6 grid gap-4">
                    <CheckoutInput
                      label="Número do cartão"
                      value={card.number}
                      onChange={(v) => {
                        const b = detectBrand(v)
                        setCard((c) => ({ ...c, number: maskCardNumber(v, b) }))
                      }}
                      onBlur={() => blur('number')}
                      show={touched.number}
                      error={errors.number}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      right={
                        brand ? (
                          <span className="font-util border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-ash">
                            {brandLabel(brand)}
                          </span>
                        ) : null
                      }
                    />
                    <CheckoutInput
                      label="Nome no cartão"
                      value={card.name}
                      onChange={(v) => setCard((c) => ({ ...c, name: v }))}
                      onBlur={() => blur('name')}
                      show={touched.name}
                      error={errors.name}
                      placeholder="Como está impresso"
                      autoComplete="cc-name"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <CheckoutInput
                        label="Validade"
                        value={card.exp}
                        onChange={(v) => setCard((c) => ({ ...c, exp: maskExpiry(v) }))}
                        onBlur={() => blur('exp')}
                        show={touched.exp}
                        error={errors.exp}
                        placeholder="MM/AA"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                      <CheckoutInput
                        label="CVV"
                        value={card.cvc}
                        onChange={(v) => setCard((c) => ({ ...c, cvc: onlyDigits(v).slice(0, cvcLength(brand)) }))}
                        onBlur={() => blur('cvc')}
                        show={touched.cvc}
                        error={errors.cvc}
                        placeholder={brand === 'amex' ? '0000' : '000'}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                    </div>

                    {/* parcelas */}
                    <label className="block">
                      <span className="font-util mb-2 block text-[11px] uppercase tracking-[0.2em] text-faint">
                        Parcelas
                      </span>
                      <div className="relative">
                        <select
                          value={selN}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full appearance-none border border-line bg-ink px-4 py-3 pr-10 text-[15px] text-bone focus:border-blood focus:outline-none"
                        >
                          {installmentList.map((opt) => (
                            <option key={opt.n} value={opt.n} className="bg-panel text-bone">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <Chevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                      </div>
                    </label>
                  </motion.div>
                )}

                {/* pix */}
                {method === 'pix' && (
                  <motion.div {...fade} className="mt-6">
                    <div className="flex flex-col items-center gap-4 border border-line bg-ink/40 p-6 sm:flex-row sm:items-center sm:gap-6">
                      <div className="shrink-0 bg-white p-2.5">
                        <MockQR seed={`${pack.id}-${total}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-[22px] font-extrabold leading-tight">
                          Pague com Pix em segundos
                        </h3>
                        <p className="mt-1.5 text-[13px] text-ash">
                          Abra o app do seu banco, escaneie o QR ou use o código copia e cola. A
                          liberação é na hora.
                        </p>
                        <span className="font-util mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-faint">
                          <Lock className="h-3.5 w-3.5" /> Expira em 30 min
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-stretch gap-2">
                      <code className="min-w-0 flex-1 truncate border border-line bg-ink px-3 py-3 text-[12px] text-ash">
                        {pixCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(pixCode, 'pix')}
                        className="font-util inline-flex shrink-0 items-center gap-2 border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
                      >
                        {copied === 'pix' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied === 'pix' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* boleto */}
                {method === 'boleto' && (
                  <motion.div {...fade} className="mt-6">
                    <div className="border border-line bg-ink/40 p-6">
                      <div className="bg-white p-3">
                        <MockBarcode seed={`${pack.id}-${total}`} />
                      </div>
                      <div className="mt-3 flex items-stretch gap-2">
                        <code className="min-w-0 flex-1 truncate border border-line bg-ink px-3 py-3 text-[12px] text-ash">
                          {boletoLine}
                        </code>
                        <button
                          type="button"
                          onClick={() => copy(boletoLine, 'boleto')}
                          className="font-util inline-flex shrink-0 items-center gap-2 border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
                        >
                          {copied === 'boleto' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied === 'boleto' ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <p className="mt-3 text-[13px] text-ash">
                        O boleto vence em 3 dias úteis. A compensação leva até 2 dias e o pack libera
                        automaticamente assim que o pagamento cair.
                      </p>
                    </div>
                  </motion.div>
                )}
              </section>

              {/* CTA */}
              <div className="mt-6">
                {submitError && (
                  <div className="mb-4 border border-blood/50 bg-blood/10 px-4 py-3 text-[13px] text-bone">
                    {submitError}
                  </div>
                )}
                <Button type="submit" full disabled={status === 'processing'}>
                  {status === 'processing' ? (
                    <>
                      <Spinner className={`h-4 w-4 ${reduce ? '' : 'animate-spin'}`} />
                      Processando…
                    </>
                  ) : (
                    payLabel
                  )}
                </Button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-faint">
                  <span className="font-util inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
                    <Shield className="h-3.5 w-3.5" /> Compra 100% segura
                  </span>
                  <span className="font-util inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
                    <Check className="h-3.5 w-3.5" /> Garantia de 7 dias
                  </span>
                </div>
                <p className="font-util mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-faint/70">
                  Checkout conectado à API — gateway em modo demonstração, nada é cobrado
                </p>
              </div>
            </form>

            {/* ── resumo (desktop, sticky) ── */}
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-[90px]">{summary}</div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
