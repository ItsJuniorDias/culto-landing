import { useState } from 'react'
import Button from './Button'
import { BUDGET_OPTIONS, submitQuote, fireLead, waUrl, buildQuoteMessage } from '../lib/leads'

/*
 * Formulário de orçamento dos serviços (Sites e Motion).
 *
 * POR QUE EXISTE: o único caminho de conversão dos serviços era o botão de
 * WhatsApp. Isso perde (a) quem está no desktop sem WhatsApp Web à mão, (b) quem
 * tem receio de já abrir conversa, e (c) a qualificação do lead. Aqui o visitante
 * monta um briefing curto (nome, faixa de orçamento e o que precisa) e o submit
 * abre o WhatsApp com a MENSAGEM JÁ PRONTA — o lead cai qualificado e o Pixel
 * registra `Lead` (com valor), que é o evento que a campanha otimiza.
 *
 * Tudo é opcional menos o nome — menos campo, mais gente termina.
 *
 * Props:
 *   service   → 'sites' | 'motion'
 *   phone     → { display, tel } (fallback "prefere ligar?")
 */
const inputCls =
  'w-full border border-line bg-pit px-4 py-3 text-[15px] text-bone placeholder:text-faint outline-none transition-colors focus:border-blood'

const labelCls =
  'font-util mb-2 block text-[11px] uppercase tracking-[0.16em] text-ash'

export default function QuoteForm({ service = 'sites', phone }) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [brief, setBrief] = useState('')
  const [error, setError] = useState('')

  const budgets = BUDGET_OPTIONS[service] || BUDGET_OPTIONS.sites

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Falta só o seu nome pra começar.')
      return
    }
    setError('')
    submitQuote({ service, name, budget, brief })
  }

  // Escape hatch: manda "oi" direto no WhatsApp, sem preencher nada — mas ainda
  // conta como Lead (é clique de alta intenção num CTA de orçamento).
  const directHref = waUrl(buildQuoteMessage({ service }), service)
  const onDirect = () => fireLead({ service })

  return (
    <div className="mx-auto mt-9 max-w-[540px] text-left">
      <div className="grid gap-4">
        <div>
          <label htmlFor="q-name" className={labelCls}>
            Seu nome
          </label>
          <input
            id="q-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como te chamo?"
            autoComplete="name"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="q-budget" className={labelCls}>
            Faixa de orçamento
          </label>
          <div className="relative">
            <select
              id="q-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${inputCls} appearance-none pr-10`}
            >
              <option value="">Escolha uma faixa (opcional)</option>
              {budgets.map((b) => (
                <option key={b} value={b} className="bg-pit text-bone">
                  {b}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-ash"
              fill="none"
              strokeWidth="2.2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="q-brief" className={labelCls}>
            {service === 'motion' ? 'O que você precisa animar?' : 'Conta a ideia'}
          </label>
          <textarea
            id="q-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={3}
            placeholder={
              service === 'motion'
                ? 'Ex.: um reels de 20s pra lançar um produto…'
                : 'Ex.: uma landing pra captar leads do meu curso…'
            }
            className={`${inputCls} resize-none`}
          />
        </div>

        {error && (
          <p className="font-util text-[12px] uppercase tracking-[0.1em] text-blood-2">
            {error}
          </p>
        )}

        <Button as="button" onClick={handleSubmit} full>
          Chamar no WhatsApp ↗
        </Button>
      </div>

      {/* fallbacks: WhatsApp direto + telefone */}
      <div className="mt-5 flex flex-col items-center gap-2 text-center">
        <a
          href={directHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onDirect}
          className="font-util text-[12px] uppercase tracking-[0.14em] text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
        >
          ou só mandar um oi no WhatsApp
        </a>
        {phone && (
          <p className="font-util text-[12px] uppercase tracking-[0.14em] text-faint">
            Prefere ligar?{' '}
            <a
              href={`tel:${phone.tel}`}
              className="text-bone underline-offset-4 transition-colors hover:text-blood hover:underline"
            >
              {phone.display}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
