import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import StoreNav from '../components/StoreNav'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import { Halftone, Burst } from '../components/Decor'
import { useAuth } from '../context/AuthContext'
import { useDevMode } from '../context/DevModeContext'
import { byId } from '../data/catalog'
import { downloadFile } from '../lib/download'
import { parseReturn, readPending, clearPending, readPendingPayment, clearPendingPayment, isApproved, isPending } from '../lib/checkout'
import { api } from '../lib/api'
import { EASE } from '../lib/motion'
import QRCode from 'react-qr-code'

export default function CheckoutReturn() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { user, purchase, recordDownload } = useAuth()
  const { devMode } = useDevMode()
  const [resolved, setResolved] = useState(null) // { kind, pack, orderId }
  const [confirming, setConfirming] = useState(false)
  const [payment, setPayment] = useState(null) // Pix/boleto guardado no checkout
  const [copied, setCopied] = useState(false)

  // Resolve o estado da compra.
  //  Fluxo novo  (nossa API): ?order=<id> → consulta o status REAL no servidor.
  //  Fluxo legado (Mercado Pago): status anexado na URL.
  const resolve = async () => {
    const { orderId, status } = parseReturn()
    const pending = readPending()

    if (orderId) {
      try {
        const { order } = await api.getCheckoutSession(orderId)
        const pack = byId(order.packId) || byId(pending?.id) || null
        if (order.status === 'paid') {
          clearPendingPayment(orderId)
          if (user && pack) {
            purchase(pack.id) // libera o pack na conta logada
            clearPending()
            setResolved({ kind: 'approved', pack, orderId })
          } else if (pack) {
            setResolved({ kind: 'need-login', pack, orderId }) // pago, mas falta entrar
          } else {
            setResolved({ kind: 'approved-unknown', pack: null, orderId })
          }
        } else if (order.status === 'pending' || order.status === 'processing') {
          setResolved({ kind: 'pending', pack, orderId })
        } else {
          // failed | expired | canceled | refunded
          setResolved({ kind: 'failed', pack, orderId })
        }
      } catch {
        setResolved({ kind: 'failed', pack: byId(pending?.id) || null, orderId })
      }
      return
    }

    // ── Fluxo legado (Mercado Pago via URL) ──
    const pid = parseReturn().packFromUrl || pending?.id || ''
    const pack = byId(pid) || null
    if (isApproved(status)) {
      if (user && pack) {
        purchase(pack.id)
        clearPending()
        setResolved({ kind: 'approved', pack })
      } else if (pack) {
        setResolved({ kind: 'need-login', pack })
      } else {
        setResolved({ kind: 'approved-unknown', pack: null })
      }
    } else if (isPending(status)) {
      setResolved({ kind: 'pending', pack })
    } else if (status) {
      setResolved({ kind: 'failed', pack })
    } else {
      setResolved({ kind: 'none', pack })
    }
  }

  // Resolve ao montar e re-resolve se o usuário logar (fluxo need-login volta pra cá).
  useEffect(() => {
    resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Lê o Pix/boleto guardado no checkout (copia-e-cola + QR) pra exibir aqui.
  useEffect(() => {
    const { orderId } = parseReturn()
    if (orderId) setPayment(readPendingPayment(orderId))
  }, [])

  // Pix/boleto pendente: faz polling no servidor até o pagamento confirmar.
  useEffect(() => {
    if (resolved?.kind !== 'pending' || !resolved?.orderId) return
    let tries = 0
    const id = setInterval(() => {
      tries += 1
      if (tries > 15) {
        clearInterval(id) // desiste depois de ~1 min; usuário pode atualizar à mão
        return
      }
      resolve()
    }, 4000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved?.kind, resolved?.orderId])

  const handleDownload = (pack) => {
    downloadFile(pack.file, pack.fileName)
    recordDownload(pack.id)
  }

  const copyCode = (text) => {
    if (!text) return
    try {
      navigator.clipboard?.writeText(text)
    } catch {
      /* clipboard indisponível */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // [DEV] Confirma o pagamento simulando o webhook do gateway (mock).
  const confirmPayment = async () => {
    if (!resolved?.orderId || confirming) return
    setConfirming(true)
    try {
      await api.simulateWebhook({ orderId: resolved.orderId, status: 'paid' })
      await resolve()
    } catch {
      /* mantém o polling rodando */
    } finally {
      setConfirming(false)
    }
  }

  const r = resolved || { kind: 'loading', pack: null }
  const pack = r.pack
  const devVisible = import.meta.env.DEV || devMode

  const goLogin = () =>
    navigate('/login', { state: { from: `/compra/retorno${window.location.search}` } })

  // Conteúdo por estado
  let eyebrow = 'Compra'
  let title = 'Processando…'
  let body = null
  let actions = null

  if (r.kind === 'approved') {
    eyebrow = 'Compra confirmada'
    title = 'Pack liberado.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        {pack ? `O ${pack.title} já está na sua biblioteca.` : 'Tudo certo com o pagamento.'} Pode
        baixar agora.
      </p>
    )
    actions = (
      <div className="mt-7 flex flex-col gap-3">
        {pack && (
          <Button as="button" full onClick={() => handleDownload(pack)}>
            Baixar {pack.title} ↓
          </Button>
        )}
        <div className="flex flex-wrap gap-3">
          <Button to="/dashboard" variant="ghost" className="flex-1">
            Ir pro painel
          </Button>
          {pack && (
            <Button to={`/pack/${pack.id}`} variant="ghost" className="flex-1">
              Ver o pack
            </Button>
          )}
        </div>
      </div>
    )
  } else if (r.kind === 'need-login') {
    eyebrow = 'Pagamento aprovado'
    title = 'Falta um passo.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        Entre na sua conta para liberar {pack ? `o ${pack.title}` : 'o pack'} no seu acesso.
      </p>
    )
    actions = (
      <div className="mt-7">
        <Button as="button" full onClick={goLogin}>
          Entrar e liberar ↗
        </Button>
      </div>
    )
  } else if (r.kind === 'approved-unknown') {
    eyebrow = 'Compra confirmada'
    title = 'Pagamento recebido.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        Acesse seu painel para baixar o pack liberado.
      </p>
    )
    actions = (
      <div className="mt-7">
        <Button to="/dashboard" full>
          Ir pro painel ↗
        </Button>
      </div>
    )
  } else if (r.kind === 'pending') {
    eyebrow = 'Pagamento em processamento'
    title = 'Quase lá.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        Assim que o pagamento for aprovado, {pack ? `o ${pack.title}` : 'o pack'} libera
        automaticamente na sua conta. Pode levar alguns minutos no Pix ou boleto — esta página
        atualiza sozinha.
      </p>
    )
    actions = (
      <div className="mt-7 flex flex-col gap-3">
        {devVisible && (
          <Button as="button" full onClick={confirmPayment} disabled={confirming}>
            {confirming ? 'Confirmando…' : 'Simular confirmação do pagamento ↗'}
          </Button>
        )}
        <div className="flex flex-wrap gap-3">
          <Button to="/dashboard" className="flex-1">
            Ir pro painel
          </Button>
          {pack && (
            <Button to={`/pack/${pack.id}`} variant="ghost" className="flex-1">
              Ver o pack
            </Button>
          )}
        </div>
      </div>
    )
  } else if (r.kind === 'failed') {
    eyebrow = 'Pagamento não concluído'
    title = 'Não rolou dessa vez.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        O pagamento não foi concluído e nada foi cobrado. Você pode tentar de novo.
      </p>
    )
    actions = (
      <div className="mt-7 flex flex-wrap gap-3">
        <Button to={pack ? `/pack/${pack.id}` : '/#packs'} className="flex-1">
          Tentar de novo
        </Button>
        <Button to="/" variant="ghost" className="flex-1">
          Voltar ao site
        </Button>
      </div>
    )
  } else if (r.kind === 'none') {
    eyebrow = 'Compra'
    title = 'Nada por aqui.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        Nenhuma compra em andamento. Escolha um pack no catálogo para começar.
      </p>
    )
    actions = (
      <div className="mt-7">
        <Button to="/#packs" full>
          Ver o catálogo ↗
        </Button>
      </div>
    )
  }

  // Bloco do Pix/boleto (copia-e-cola + QR) — só enquanto o pagamento está pendente.
  let paymentBlock = null
  if (r.kind === 'pending' && payment?.pix) {
    paymentBlock = (
      <div className="mt-6 border border-line bg-ink/60 p-5">
        {payment.pix.copyPaste && (
          <div className="mx-auto mb-4 w-fit bg-white p-3">
            <QRCode value={payment.pix.copyPaste} size={172} />
          </div>
        )}
        <p className="font-util mb-2 text-[11px] uppercase tracking-[0.2em] text-faint">
          Pix copia e cola
        </p>
        <div className="flex items-stretch gap-2">
          <code className="flex-1 truncate border border-line bg-ink px-3 py-2 text-[12px] text-ash">
            {payment.pix.copyPaste}
          </code>
          <button
            type="button"
            onClick={() => copyCode(payment.pix.copyPaste)}
            className="font-util shrink-0 border border-line px-3 text-[11px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-blood"
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <p className="mt-3 text-[12px] text-faint">
          Abra o app do banco, escaneie o QR ou cole o código. A liberação é na hora.
        </p>
      </div>
    )
  } else if (r.kind === 'pending' && payment?.boleto) {
    paymentBlock = (
      <div className="mt-6 border border-line bg-ink/60 p-5">
        <p className="font-util mb-2 text-[11px] uppercase tracking-[0.2em] text-faint">
          Linha digitável do boleto
        </p>
        <div className="flex items-stretch gap-2">
          <code className="flex-1 truncate border border-line bg-ink px-3 py-2 text-[12px] text-ash">
            {payment.boleto.line}
          </code>
          <button
            type="button"
            onClick={() => copyCode(payment.boleto.line)}
            className="font-util shrink-0 border border-line px-3 text-[11px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-blood"
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        {payment.boleto.pdfUrl && (
          <a
            href={payment.boleto.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="font-util mt-3 inline-block text-[12px] uppercase tracking-[0.1em] text-blood-2 hover:underline"
          >
            Abrir boleto (PDF) ↗
          </a>
        )}
      </div>
    )
  }

  return (
    <>
      <StoreNav />
      <main className="relative grid min-h-[calc(100vh-70px)] place-items-center overflow-hidden px-6 py-16">
        <Halftone />
        <Burst pos="tl" />
        <Burst pos="br" />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22, scale: 0.98 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative z-[2] w-full max-w-[480px] border border-line bg-panel/90 p-8 backdrop-blur-sm sm:p-10"
        >
          <Eyebrow solo>{eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[40px] font-black leading-[0.92] sm:text-[46px]">
            {title}
          </h1>
          {body}
          {paymentBlock}
          {actions}
        </motion.div>
      </main>
    </>
  )
}
