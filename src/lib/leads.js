// Camada de captação de lead dos serviços (Sites e Motion).
//
// PROBLEMA QUE ISSO RESOLVE: antes, os CTAs de orçamento só abriam o WhatsApp e
// o Pixel registrava no máximo um `Contact` (via listener global). Pra otimizar
// campanha de geração de lead no Meta, o evento que importa é o `Lead` — e ele
// não estava sendo disparado em lugar nenhum. Aqui a gente centraliza:
//   1. dispara `Lead` (com valor proxy) + `Contact` no mesmo clique de alta
//      intenção (formulário de orçamento ou botão "chamar no WhatsApp");
//   2. monta uma mensagem de WhatsApp JÁ QUALIFICADA (nome, orçamento, briefing)
//      pra o lead cair pronto pra fechar, não um "oi" solto.
//
// Tudo à prova de bala: se o Pixel não carregou, os eventos viram no-op.

import { lead as pixelLead, contact as pixelContact } from './pixel'
import { SITES_WHATSAPP, MOTION_WHATSAPP } from '../data/screens'

// ── Valor proxy do lead (BRL) ───────────────────────────────────────────────
// O Meta consegue otimizar por VALOR (VBO) mesmo em campanha de lead. Esse número
// é uma ESTIMATIVA de quanto vale, em média, um lead qualificado de cada serviço
// (ticket médio × taxa de fechamento estimada). Não é receita real — é um sinal
// pro algoritmo priorizar quem pede orçamento de projeto maior.
// AJUSTE conforme seus números reais forem aparecendo.
export const LEAD_VALUE = {
  sites: 600, // ticket médio alto (landing 2.9k → sistema 14.9k)
  motion: 350, // reels 1.2k → campanha 8.9k
}

// Origem do serviço → número de WhatsApp certo.
export const SERVICE_WHATSAPP = {
  sites: SITES_WHATSAPP,
  motion: MOTION_WHATSAPP,
}

// Rótulo humano do serviço (usado nos parâmetros do evento).
const SERVICE_LABEL = {
  sites: 'Criação de sites',
  motion: 'Vídeo & motion',
}

// Monta a URL do WhatsApp com a mensagem já preenchida.
export function waUrl(message, service = 'sites') {
  const number = SERVICE_WHATSAPP[service] || SITES_WHATSAPP
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

// Monta uma mensagem de orçamento qualificada a partir dos campos do formulário.
// Linhas vazias são omitidas — se o cara só botou o nome, a mensagem sai limpa.
export function buildQuoteMessage({ service = 'sites', name, budget, brief } = {}) {
  const intro =
    service === 'motion'
      ? 'Oi! Quero um orçamento de vídeo/motion.'
      : 'Oi! Quero um orçamento de site.'

  const lines = [intro, '']
  if (name?.trim()) lines.push(`Nome: ${name.trim()}`)
  if (budget?.trim()) lines.push(`Orçamento: ${budget.trim()}`)
  if (brief?.trim()) {
    lines.push(service === 'motion' ? 'Preciso de:' : 'Sobre o projeto:')
    lines.push(brief.trim())
  }
  lines.push('', '(via cultododesigner.com.br)')
  return lines.join('\n')
}

// Dispara os eventos de conversão de lead. Chamado no clique/submit de alta
// intenção — NÃO no PageView nem em clique qualquer (isso o listener global já faz).
export function fireLead({ service = 'sites', name, budget, contentName } = {}) {
  const params = {
    content_name: contentName || SERVICE_LABEL[service] || service,
    content_category: service,
    value: LEAD_VALUE[service] ?? 0,
    currency: 'BRL',
  }
  pixelLead(params)
  // Contact reforça o sinal de contato (o listener global também pega, mas aqui
  // garantimos o método correto mesmo se o clique não passar por um <a>).
  pixelContact({ contact_method: 'whatsapp', content_category: service })
  return params
}

// Fluxo completo do formulário de orçamento: dispara Lead e abre o WhatsApp com a
// mensagem qualificada. Retorna a URL (útil pra testes/telemetria).
export function submitQuote({ service = 'sites', name, budget, brief } = {}) {
  fireLead({ service, name, budget })
  const message = buildQuoteMessage({ service, name, budget, brief })
  const url = waUrl(message, service)
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
  return url
}

// Opções de orçamento por serviço (alimentam o <select> do formulário).
// Refletem os planos de content.js — mantém o lead ancorado numa faixa de preço.
export const BUDGET_OPTIONS = {
  sites: [
    'Landing (a partir de R$ 2.900)',
    'Institucional (a partir de R$ 6.900)',
    'Sistema / web app (a partir de R$ 14.900)',
    'Ainda não sei',
  ],
  motion: [
    'Social / Reels (a partir de R$ 1.200)',
    'Explainer / Promo (a partir de R$ 3.900)',
    'Campanha / Marca (a partir de R$ 8.900)',
    'Ainda não sei',
  ],
}
