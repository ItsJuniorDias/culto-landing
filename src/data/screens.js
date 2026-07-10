// Conteúdo das telas dedicadas (Packs · Sites · Motion).
// Mantido separado de content.js pra não misturar a copy da loja com a dos
// serviços. Os planos (siteTiers / motionTiers) continuam vindo de content.js —
// esta é a única fonte de verdade de preços, então nada duplica.

// ── Navegação principal entre as três telas ─────────────────────────────────
// Cada tela é uma rota própria. `key` casa com a prop `active` do cabeçalho.
export const screens = [
  { key: 'packs', label: 'Packs', to: '/', blurb: 'Assets prontos pra baixar' },
  { key: 'sites', label: 'Sites', to: '/sites', blurb: 'Sites sob medida, do zero' },
  { key: 'motion', label: 'Motion', to: '/motion', blurb: 'Vídeo & motion sob encomenda' },
]

// ── Tela: Sites ─────────────────────────────────────────────────────────────
export const sitesHero = {
  eyebrow: 'Criação de sites',
  titleLines: ['Sites sob medida.', 'Nada de template.'],
  lead: 'Código do zero, animação de estúdio e performance de verdade. Cada site é desenhado pra sua marca e entregue no ar — não é tema comprado com a sua logo por cima.',
  primary: { label: 'Pedir orçamento', quote: 'Oi! Quero um orçamento de um site.' },
  secondary: { label: 'Ver planos', href: '#planos' },
  // barra de status/trust abaixo dos CTAs
  trust: ['Orçamento em 24h', 'Deploy incluso', 'Nota fiscal'],
  // blocos que montam o mock do navegador no hero (a assinatura da tela)
  mockUrl: 'seuprojeto.com.br',
}

// Processo real e ordenado → numeração faz sentido aqui.
export const sitesProcess = [
  {
    n: '01',
    title: 'Briefing & escopo',
    text: 'A gente alinha objetivo, referências e o que a página precisa fazer. Você recebe escopo fechado e prazo antes de começar.',
    meta: 'Dia 1–2',
  },
  {
    n: '02',
    title: 'Design & protótipo',
    text: 'Layout exclusivo desenhado pra sua marca, revisado com você em protótipo navegável — nada de template genérico.',
    meta: 'Semana 1',
  },
  {
    n: '03',
    title: 'Código & animação',
    text: 'Front-end do zero em React, com animação sob medida, responsivo de verdade e Core Web Vitals no verde.',
    meta: 'Semana 2',
  },
  {
    n: '04',
    title: 'Deploy & suporte',
    text: 'Publico no ar com domínio e SSL configurados, analytics ligado e um período de ajustes pós-entrega incluso.',
    meta: 'Entrega',
  },
]

// Capacidades — o que entra em todo projeto, independente do plano.
export const sitesCapabilities = [
  { t: 'Design exclusivo', d: 'Nada de tema comprado. Cada tela é desenhada pra sua marca.' },
  { t: 'Animação de estúdio', d: 'Micro-interações e reveals no scroll com Framer Motion.' },
  { t: 'Performance real', d: 'Core Web Vitals no verde, imagens otimizadas, carregamento rápido.' },
  { t: 'SEO técnico', d: 'Meta tags, dados estruturados e semântica prontos pro Google.' },
  { t: 'Responsivo', d: 'Do celular ao ultrawide, testado em tela de verdade.' },
  { t: 'Deploy & domínio', d: 'Publico no ar com SSL, CDN e domínio configurado.' },
]

export const sitesFaqs = [
  {
    q: 'Vocês usam template ou tema pronto?',
    a: 'Não. Cada site é desenhado e codado do zero, específico pra sua marca. Você não vai encontrar o mesmo layout em outro cliente. É por isso que o resultado tem cara de estúdio, não de construtor de site.',
  },
  {
    q: 'Quanto tempo leva pra ficar pronto?',
    a: 'Uma landing page fica pronta em cerca de 2 semanas; um site institucional, de 3 a 4 semanas. Sistemas sob medida dependem do escopo, que a gente fecha junto antes de começar. Você recebe o prazo por escrito no orçamento.',
  },
  {
    q: 'Eu consigo editar o conteúdo depois sozinho?',
    a: 'Sim, nos planos institucionais em diante. Entrego com um CMS leve pra você trocar textos, imagens e posts sem depender de mim. Na landing simples, ajustes de conteúdo entram nas rodadas de revisão inclusas.',
  },
  {
    q: 'O que já vem incluso no preço?',
    a: 'Design, código, animação, responsividade, SEO on-page, deploy e domínio configurado, mais as rodadas de ajuste do plano. Você não paga separado por publicar no ar nem por deixar o site rápido.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: '50% pra começar e 50% na entrega, com nota fiscal. Pix, cartão ou boleto. Nada de mensalidade escondida — hospedagem e domínio ficam no seu nome, você é dono de tudo.',
  },
  {
    q: 'E se eu precisar de algo além de um site?',
    a: 'O plano Sob medida cobre sistemas completos: login, painel, pagamentos, backend próprio e integrações de API. Se o seu projeto é mais um produto do que uma página, é por aí que a gente começa a conversa.',
  },
]

// ── Tela: Motion ────────────────────────────────────────────────────────────
export const motionHero = {
  eyebrow: 'Vídeo & motion',
  titleLines: ['Motion que', 'faz o feed parar.'],
  lead: 'Do reels vertical ao explainer de produto: animação feita à mão em After Effects, com trilha, som e color no capricho. A partir de R$ 60 por segundo.',
  primary: { label: 'Pedir orçamento', quote: 'Oi! Quero um orçamento de vídeo/motion.' },
  secondary: { label: 'Ver o showreel', href: '#showreel' },
  trust: ['4K ProRes & H.264', 'Trilha licenciada', 'Legendas inclusas'],
  // trilhas do editor mostradas no hero (a assinatura da tela)
  tracks: [
    { label: 'V1 · Vídeo', kind: 'clip', segs: [[0, 34], [40, 78]] },
    { label: 'TXT · Motion', kind: 'clip', segs: [[8, 30], [52, 70], [82, 96]] },
    { label: 'SFX · Áudio', kind: 'wave', segs: [[0, 100]] },
  ],
}

// Processo real e ordenado → numeração faz sentido.
export const motionProcess = [
  {
    n: '01',
    title: 'Roteiro & storyboard',
    text: 'Definimos a mensagem, o ritmo e os cortes-chave. Você aprova o storyboard antes de qualquer frame animar.',
    meta: 'Pré',
  },
  {
    n: '02',
    title: 'Ilustração & design',
    text: 'Cenas, personagem e elementos gráficos desenhados no estilo da sua marca — nada de biblioteca genérica.',
    meta: 'Arte',
  },
  {
    n: '03',
    title: 'Animação',
    text: 'Animação à mão em After Effects, com timing e easing de estúdio. É onde a peça ganha vida.',
    meta: 'Produção',
  },
  {
    n: '04',
    title: 'Som, color & entrega',
    text: 'Trilha, SFX e color grading no capricho. Você recebe em ProRes e H.264, com legendas e cortes pra cada formato.',
    meta: 'Finalização',
  },
]

// Chips de entrega mostrados na tela de motion.
export const motionDeliverables = [
  '9:16 · Reels & Shorts',
  '1:1 · Feed',
  '16:9 · YouTube',
  'ProRes 4K',
  'H.264 web',
  'Legenda .srt',
  'Trilha licenciada',
  '60 fps',
]

export const motionFaqs = [
  {
    q: 'Como é cobrado o preço do vídeo?',
    a: 'Por porte e duração, a partir de R$ 60 por segundo animado. Cada plano já traz uma faixa de duração e escopo; peças mais longas ou com animação 2D/3D complexa entram no orçamento sob consulta. Você sabe o valor fechado antes de aprovar.',
  },
  {
    q: 'Vocês fazem o roteiro ou eu preciso mandar pronto?',
    a: 'Fazemos. Nos planos Explainer em diante, roteiro e storyboard estão inclusos — você aprova antes de a gente animar. Se você já tem roteiro, melhor ainda: a gente adapta pro ritmo do vídeo.',
  },
  {
    q: 'Em quais formatos eu recebo o vídeo?',
    a: 'Em ProRes 4K pra arquivo e H.264 otimizado pra web, mais os cortes pra cada proporção que você precisar: 9:16 pra Reels e Shorts, 1:1 pro feed e 16:9 pro YouTube. Legenda embutida ou em .srt, você escolhe.',
  },
  {
    q: 'A trilha e os efeitos são liberados pra usar?',
    a: 'Sim. Trabalho só com trilha e SFX licenciados pra uso comercial, então você pode subir em qualquer plataforma sem risco de takedown por direitos autorais.',
  },
  {
    q: 'Quantas rodadas de ajuste eu tenho?',
    a: 'De 2 a 3 rodadas conforme o plano, já inclusas no preço. Ajustes acontecem nas etapas certas — storyboard, animação e finalização — pra evitar retrabalho e manter o prazo.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Um reels social sai em cerca de 5 dias; um explainer de até 60s leva um pouco mais por causa do roteiro e storyboard. Campanhas maiores têm cronograma próprio, combinado no fechamento do escopo.',
  },
]

// ── CTA de serviço (Sites e Motion) ─────────────────────────────────────────
export const serviceCta = {
  sites: {
    kicker: 'Bora tirar do papel?',
    title: 'Seu próximo site\ncomeça com uma conversa.',
    lead: 'Manda a ideia no WhatsApp e você recebe um orçamento com escopo e prazo em até 24h. Sem compromisso, sem enrolação.',
    quote: 'Oi! Quero um orçamento de site. Minha ideia é:',
    foot: 'Orçamento em 24h · 50% pra começar, 50% na entrega · Nota fiscal',
  },
  motion: {
    kicker: 'Tem um vídeo em mente?',
    title: 'Coloque a sua marca\nem movimento.',
    lead: 'Conta o que você precisa animar e você recebe um orçamento com prazo e formato em até 24h. Do reels ao filme de campanha.',
    quote: 'Oi! Quero um orçamento de vídeo/motion. Preciso de:',
    foot: 'Entrega em ProRes & H.264 · trilha licenciada · legendas inclusas',
  },
}
