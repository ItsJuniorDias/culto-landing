import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import StoreNav from '../components/StoreNav'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import { Halftone, Burst } from '../components/Decor'
import { useAuth } from '../context/AuthContext'
import { byId } from '../data/catalog'
import { downloadFile } from '../lib/download'
import { parseReturn, readPending, clearPending, isApproved, isPending } from '../lib/checkout'
import { EASE } from '../lib/motion'

export default function CheckoutReturn() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { user, purchase, recordDownload } = useAuth()
  const [resolved, setResolved] = useState(null) // { kind, pack }

  useEffect(() => {
    const { status } = parseReturn()
    const pending = readPending()
    const pid = parseReturn().packFromUrl || pending?.id || ''
    const pack = byId(pid) || null

    if (isApproved(status)) {
      if (user && pack) {
        purchase(pack.id) // libera o pack para a conta logada
        clearPending()
        setResolved({ kind: 'approved', pack })
      } else if (pack) {
        setResolved({ kind: 'need-login', pack }) // pago, mas falta entrar
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
    // Reavalia se o usuário logar (fluxo "need-login" volta pra cá).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDownload = (pack) => {
    downloadFile(pack.file, pack.fileName)
    recordDownload(pack.id)
  }

  const r = resolved || { kind: 'loading', pack: null }
  const pack = r.pack

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
        automaticamente na sua conta. Pode levar alguns minutos no Pix ou boleto.
      </p>
    )
    actions = (
      <div className="mt-7 flex flex-wrap gap-3">
        <Button to="/dashboard" className="flex-1">
          Ir pro painel
        </Button>
        {pack && (
          <Button to={`/pack/${pack.id}`} variant="ghost" className="flex-1">
            Ver o pack
          </Button>
        )}
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
