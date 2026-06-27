import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import StoreNav from '../components/StoreNav'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import { Halftone, Burst } from '../components/Decor'
import { Copy, Check, ExternalLink, Spinner } from '../components/checkout/icons'
import { useAuth } from '../context/AuthContext'
import { useDevMode } from '../context/DevModeContext'
import { byId } from '../data/catalog'
import { downloadFile } from '../lib/download'
import {
  parseReturn,
  readPending,
  clearPending,
  readPayment,
  clearPayment,
  isApproved,
  isPending,
} from '../lib/checkout'
import { api } from '../lib/api'
import { EASE } from '../lib/motion'

// Bloco do Pix/boleto exibido enquanto o pagamento está pendente. Os dados vêm
// da criação da sessão (carregados via state da navegação ou do localStorage),
// porque o GET de status devolve só o status.
function PaymentDetails({ payment }) {
  const [copied, setCopied] = useState('')
  const copy = (text, which) => {
    try {
      navigator.clipboard?.writeText(text)
    } catch {
      /* clipboard indisponível */
    }
    setCopied(which)
    setTimeout(() => setCopied(''), 1800)
  }

  if (payment?.pix) {
    const { qrCodeImage, copyPaste } = payment.pix
    return (
      <div className="mt-6 border border-line bg-ink/40 p-5">
        {qrCodeImage ? (
          <div className="flex justify-center">
            <div className="bg-white p-3">
              <img
                src={qrCodeImage}
                alt="QR Code para pagamento via Pix"
                width={176}
                height={176}
                className="h-44 w-44"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-[13px] text-ash">
            Copie o código abaixo e pague em <span className="text-bone">Pix → Copia e cola</span> no
            app do seu banco.
          </p>
        )}

        {copyPaste && (
          <div className="mt-4 flex items-stretch gap-2">
            <code className="min-w-0 flex-1 truncate border border-line bg-ink px-3 py-3 text-[12px] text-ash">
              {copyPaste}
            </code>
            <button
              type="button"
              onClick={() => copy(copyPaste, 'pix')}
              className="font-util inline-flex shrink-0 items-center gap-2 border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
            >
              {copied === 'pix' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === 'pix' ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        )}
      </div>
    )
  }

  if (payment?.boleto) {
    const { line, pdfUrl } = payment.boleto
    return (
      <div className="mt-6 border border-line bg-ink/40 p-5">
        <span className="font-util block text-[11px] uppercase tracking-[0.2em] text-faint">
          Linha digitável
        </span>
        <div className="mt-2 flex items-stretch gap-2">
          <code className="min-w-0 flex-1 truncate border border-line bg-ink px-3 py-3 text-[12px] text-ash">
            {line}
          </code>
          <button
            type="button"
            onClick={() => copy(line, 'boleto')}
            className="font-util inline-flex shrink-0 items-center gap-2 border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
          >
            {copied === 'boleto' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'boleto' ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-util mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:text-blood"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Abrir boleto (PDF)
          </a>
        )}
      </div>
    )
  }

  return null
}

export default function CheckoutReturn() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, purchase, recordDownload } = useAuth()
  const { devMode } = useDevMode()
  const [resolved, setResolved] = useState(null) // { kind, pack, orderId }
  const [confirming, setConfirming] = useState(false)

  // orderId vem da URL; os detalhes do pagamento vêm do state da navegação
  // (Pix/boleto, recém-criados) com fallback pro localStorage (sobrevive a refresh).
  const orderId = useMemo(() => parseReturn().orderId, [])
  const payment = useMemo(
    () => location.state?.payment ?? readPayment(orderId),
    [location.state, orderId],
  )

  // Resolve o estado da compra.
  //  Fluxo atual (nossa API): ?order=<id> → consulta o status REAL no servidor.
  //  Fluxo legado (Mercado Pago): status anexado na URL.
  const resolve = async () => {
    const { orderId: oid, status } = parseReturn()
    const pending = readPending()

    if (oid) {
      try {
        const { order } = await api.getCheckoutSession(oid)
        const pack = byId(order.packId) || byId(pending?.id) || null
        if (order.status === 'paid') {
          clearPayment(oid)
          if (user && pack) {
            purchase(pack.id) // libera o pack na conta logada
            clearPending()
            setResolved({ kind: 'approved', pack, orderId: oid })
          } else if (pack) {
            setResolved({ kind: 'need-login', pack, orderId: oid }) // pago, mas falta entrar
          } else {
            setResolved({ kind: 'approved-unknown', pack: null, orderId: oid })
          }
        } else if (order.status === 'pending' || order.status === 'processing') {
          setResolved({ kind: 'pending', pack, orderId: oid })
        } else {
          // failed | expired | canceled | refunded
          clearPayment(oid)
          setResolved({ kind: 'failed', pack, orderId: oid })
        }
      } catch {
        setResolved({ kind: 'failed', pack: byId(pending?.id) || null, orderId: oid })
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

  // Pix/boleto pendente: faz polling no servidor até o pagamento confirmar.
  useEffect(() => {
    if (resolved?.kind !== 'pending' || !resolved?.orderId) return
    let tries = 0
    const id = setInterval(() => {
      tries += 1
      if (tries > 40) {
        clearInterval(id) // desiste depois de ~2 min; usuário pode atualizar à mão
        return
      }
      resolve()
    }, 3000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved?.kind, resolved?.orderId])

  const handleDownload = (pack) => {
    downloadFile(pack.file, pack.fileName)
    recordDownload(pack.id)
  }

  // [DEV] Confirma o pagamento simulando o webhook do gateway (só mock).
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
    eyebrow = 'Aguardando pagamento'
    title = payment?.pix ? 'Pague com Pix.' : payment?.boleto ? 'Boleto gerado.' : 'Quase lá.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        {payment?.pix
          ? 'Escaneie o QR ou copie o código no app do seu banco. Assim que o pagamento cair, o pack libera automaticamente — esta página atualiza sozinha.'
          : payment?.boleto
            ? 'Pague o boleto no seu banco. A compensação leva até 2 dias úteis e o pack libera automaticamente — esta página atualiza sozinha.'
            : `Assim que o pagamento for aprovado, ${pack ? `o ${pack.title}` : 'o pack'} libera automaticamente. Esta página atualiza sozinha.`}
      </p>
    )
    actions = (
      <>
        <PaymentDetails payment={payment} />
        <div className="mt-5 flex items-center justify-center gap-2 text-faint">
          <Spinner className={`h-3.5 w-3.5 ${reduce ? '' : 'animate-spin'}`} />
          <span className="font-util text-[10px] uppercase tracking-[0.16em]">
            Aguardando confirmação
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {devVisible && (
            <Button as="button" full onClick={confirmPayment} disabled={confirming}>
              {confirming ? 'Confirmando…' : 'Simular confirmação do pagamento ↗'}
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
      </>
    )
  } else if (r.kind === 'failed') {
    eyebrow = 'Pagamento não concluído'
    title = 'Não rolou dessa vez.'
    body = (
      <p className="mt-4 text-[15px] text-ash">
        O pagamento não foi concluído. Você pode tentar de novo.
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
          {actions}
        </motion.div>
      </main>
    </>
  )
}
