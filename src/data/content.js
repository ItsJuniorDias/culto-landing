// Site content kept separate from layout so copy is easy to edit in one place.

export const compat = [
  "After Effects",
  "Premiere Pro",
  "DaVinci Resolve",
  "Final Cut",
  "Photoshop",
  "Illustrator",
  "Figma",
  "Blender",
];

export const packs = [
  {
    id: "design",
    kind: "Design",
    name: "Design Pack",
    desc: "Para designers gráficos e social media.",
    price: "17,90",
    old: "R$ 35,90",
    cta: "Comprar Design Pack",
    ctaVariant: "ghost",
    featured: false,
    feats: [
      { t: "150 mockups editáveis em PSD", on: true },
      { t: "80 fontes com licença comercial", on: true },
      { t: "300 ícones + 120 templates de redes", on: true },
      { t: "150 texturas e overlays em alta", on: true },
      { t: "Assets de vídeo e motion", on: false },
    ],
  },
  {
    id: "bundle",
    kind: "Design + Vídeo + Motion",
    name: "Bundle Completo",
    desc: "Todo o catálogo, com desconto e updates vitalícios.",
    price: "36,90",
    old: "R$ 79,90",
    cta: "Quero o Bundle ↗",
    ctaVariant: "primary",
    featured: true,
    tag: "Mais vendido",
    feats: [
      { t: "Tudo do Design + Motion Pack", on: true, strong: true },
      { t: "2.300+ assets no total", on: true },
      { t: "Atualizações vitalícias grátis", on: true },
      { t: "Acesso à comunidade no Discord", on: true },
      { t: "Suporte prioritário", on: true },
    ],
  },
  {
    id: "motion",
    kind: "Vídeo + Motion",
    name: "Motion Pack",
    desc: "Para editores de vídeo e motion designers.",
    price: "22,90",
    old: "R$ 45,90",
    cta: "Comprar Motion Pack",
    ctaVariant: "ghost",
    featured: false,
    feats: [
      { t: "120 transições para AE e Premiere", on: true },
      { t: "90 LUTs de color grading", on: true },
      { t: "200 SFX + trilhas livres", on: true },
      { t: "60 lower thirds, intros e outros", on: true },
      { t: "Mockups e fontes de design", on: false },
    ],
  },
];

export const steps = [
  {
    n: "01",
    title: "Escolha o pack",
    text: "Selecione o pack que combina com o seu trabalho. Pagamento único, no Pix ou cartão, sem mensalidade.",
  },
  {
    n: "02",
    title: "Baixe na hora",
    text: "O link de download chega no seu e-mail na hora da compra. Tudo já organizado em pastas por categoria.",
  },
  {
    n: "03",
    title: "Arraste e crie",
    text: "Importe direto no seu editor favorito, arraste pra timeline ou pra arte e entregue o projeto mais rápido.",
  },
];

// Seção de confiança da home (id="voices").
// Antes eram depoimentos nominais — removidos porque não dá pra comprovar num
// estúdio solo pré-lançamento (mesmo motivo pelo qual o ProofStrip dos serviços
// não inventa review). No lugar entram garantias REAIS, todas espelhando o FAQ.
// Quando tiver reviews de verdade, é só recriar um array `voices` e trocar a
// seção — a copy honesta aqui continua valendo como reforço.
export const guarantees = [
  {
    title: "Pagamento único",
    tag: "Sem assinatura",
    text: "Você compra uma vez e os arquivos são seus pra sempre — sem mensalidade nem cobrança recorrente escondida. No Bundle Completo, as atualizações futuras entram sem custo extra.",
  },
  {
    title: "Licença comercial em tudo",
    tag: "Uso liberado",
    text: "Pode usar em job de cliente, peça paga e projeto comercial, sem precisar dar créditos. A única regra é não revender os arquivos soltos como se fossem seus.",
  },
  {
    title: "7 dias de garantia",
    tag: "Risco zero",
    text: "Se os packs não fizerem sentido pro seu trabalho, é só pedir o reembolso por e-mail dentro de 7 dias. Devolvo o valor integral, sem interrogatório.",
  },
];

export const faqs = [
  {
    q: "Posso usar os assets em trabalhos de clientes?",
    a: "Sim. Todos os packs vêm com licença comercial, então você pode usar em projetos pagos, de clientes e em peças comerciais. O que não é permitido é revender os arquivos como se fossem seus.",
  },
  {
    q: "É pagamento único ou assinatura?",
    a: "Pagamento único. Você compra uma vez e fica com os arquivos para sempre, sem mensalidade. No Bundle Completo, as atualizações futuras também são incluídas sem custo extra.",
  },
  {
    q: "Em quais programas os assets funcionam?",
    a: "After Effects, Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, Illustrator, Figma e Blender, dependendo da categoria. Cada arquivo indica claramente o formato e o software recomendado.",
  },
  {
    q: "Como recebo os arquivos depois de pagar?",
    a: "O link de download é liberado na hora e enviado para o seu e-mail. São arquivos em alta resolução, organizados em pastas por categoria, prontos para importar.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia. Se os packs não fizerem sentido pro seu trabalho, é só pedir o reembolso por e-mail e devolvemos o valor integral, sem perguntas.",
  },
];

export const footerCols = [
  {
    h: "Packs",
    links: [
      { label: "Design Pack", href: "/#packs" },
      { label: "Motion Pack", href: "/#packs" },
      { label: "Bundle Completo", href: "/#packs" },
      { label: "Catálogo", href: "/#inside" },
    ],
  },
  {
    h: "Serviços",
    links: [
      { label: "Criação de sites", href: "/sites" },
      { label: "Vídeo & motion", href: "/motion" },
      { label: "Planos de site", href: "/sites#planos" },
      { label: "Projetos no ar", href: "/sites" },
    ],
  },
  {
    h: "Marca",
    links: [
      { label: "Packs", href: "/" },
      { label: "Garantias", href: "/#voices" },
      { label: "Dúvidas", href: "/#faq" },
      { label: "Afiliados", href: "#" },
    ],
  },
  {
    h: "Suporte",
    links: [
      { label: "Contato", href: "#" },
      { label: "Licença de uso", href: "#" },
      { label: "Reembolso", href: "#" },
      { label: "Termos & privacidade", href: "#" },
    ],
  },
];

export const navLinks = [
  { label: "Packs", href: "#packs" },
  { label: "Sites", href: "#sites" },
  { label: "Motion", href: "#motion" },
  { label: "Catálogo", href: "#inside" },
  { label: "Quem usa", href: "#voices" },
  { label: "Dúvidas", href: "#faq" },
];

// ── Contato / orçamentos ─────────────────────────────────────────────────────
// Usado pelos CTAs das seções de serviço (Sites e Motion).
// TROQUE os dois valores abaixo:
//   whatsapp → seu número com DDI + DDD, só dígitos. Ex.: 5519998877665
//   email    → seu e-mail de contato
export const contact = {
  whatsapp: "5521986667966", // DDI + DDD + número, só dígitos
  phone: "+5521986667966", // mesmo número, formato tel:
  phoneDisplay: "(21) 98666-7966", // como aparece na tela
  email: "contato@cultododesigner.com.br", // ← TROQUE pelo seu e-mail
};

// Monta um link wa.me já com a mensagem preenchida.
// `number` permite usar um WhatsApp diferente por seção (Sites x Motion).
export const waLink = (
  msg = "Oi! Vim pelo site do Culto e quero um orçamento.",
  number = contact.whatsapp,
) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

// ── Showreel ────────────────────────────────────────────────────────────────
// Troque pelos dados do seu vídeo. Duas formas de usar:
//   A) YouTube/Vimeo  → preencha `youtubeId` com o id do vídeo
//                       (ex.: youtu.be/AbC123 → youtubeId: 'AbC123')
//   B) Vídeo próprio   → deixe youtubeId: null e aponte `src` p/ um .mp4
//                       em /public/assets (ex.: '/assets/reel.mp4')
// `poster` é a thumb mostrada antes do play (ideal 1280×720).
export const reel = {
  youtubeId: null, // ← vídeo próprio (deixe null para usar o `src`)
  src: "/assets/promo-motion.mp4", // ← vídeo de divulgação hospedado
  poster: "/assets/promo-motion-poster.jpg", // ← capa (1º frame do vídeo)
  vertical: true, // ← peça em formato retrato (9:16) → moldura vertical
  duration: "0:28",
  stats: [
    { k: "4K", v: "ProRes & H.264" },
    { k: "60", v: "fps no render" },
    { k: "100%", v: "licença comercial" },
  ],
};

// ── Preview de motion (card do dashboard) ────────────────────────────────────
// Vídeo mostrado ao lado do card "Motion pro feed" dentro do dashboard.
// Mesma lógica do `reel`:
//   A) YouTube  → preencha `youtubeId` (ex.: youtu.be/AbC123 → 'AbC123')
//   B) Próprio  → deixe youtubeId: null e aponte `src` p/ um .mp4 em /public/assets
// `poster` é a capa mostrada antes do play. `vertical: true` avisa a moldura que a
// peça é retrato (9:16) → o vídeo entra centralizado com fundo borrado, sem corte.
export const motionPreview = {
  youtubeId: null, // ← usa o vídeo próprio (não o placeholder do YouTube)
  src: "/assets/promo-motion.mp4", // ← mesmo promo do showreel
  poster: "/assets/promo-motion-poster.jpg", // ← capa (1º frame, 464×832)
  vertical: true, // ← peça em retrato (9:16) → moldura trata o letterbox
  duration: "0:28",
  label: "Reel",
};

// ── Serviços: Criação de sites ───────────────────────────────────────────────
// Vitrine de projeto real usada como prova social da seção de sites.
export const sitesShowcase = {
  badge: "Projeto no ar",
  url: "pedagogy.com.br",
  live: "https://pedagogy.com.br",
  name: "Pedagogy",
  kicker: "App de leitura infantil",
  headline: "Stories that teach kids to read",
  sub: "Fonics, 50+ histórias e joguinhos pra crianças de 2 a 10 anos.",
  // pílulas mostradas dentro do mock do navegador (a "cara" do site)
  pills: ["2–10 anos", "7 idiomas", "Sem anúncios", "50+ histórias"],
  cta: "Download grátis",
  // o que foi entregue nesse projeto
  bullets: [
    "Landing page + funil de conversão do zero",
    "i18n em 7 idiomas e design responsivo",
    "Meta Pixel + CAPI server-side (atribuição fechada)",
    "Deploy, domínio e performance no capricho",
  ],
  stack: ["React", "Vite", "Fastify", "RevenueCat", "Meta CAPI"],
};

export const siteTiers = [
  {
    id: "landing",
    kind: "Página única",
    name: "Landing",
    from: "a partir de",
    price: "1.497",
    meta: "Entrega em ~2 semanas",
    featured: false,
    ctaVariant: "ghost",
    quote: "Oi! Quero um orçamento de uma landing page (plano Landing).",
    feats: [
      { t: "Página única de alta conversão", on: true },
      { t: "Design exclusivo + animação (Framer Motion)", on: true },
      { t: "Responsivo, SEO técnico e performance", on: true },
      { t: "Deploy + domínio configurado", on: true },
      { t: "2 rodadas de ajuste inclusas", on: true },
    ],
  },
  {
    id: "institucional",
    kind: "Multi-página",
    name: "Institucional",
    from: "a partir de",
    price: "2.997",
    meta: "Entrega em ~3 a 4 semanas",
    featured: true,
    tag: "Mais pedido",
    ctaVariant: "primary",
    quote:
      "Oi! Quero um orçamento de um site institucional (plano Institucional).",
    feats: [
      { t: "Até 6 páginas sob medida", on: true, strong: true },
      { t: "Blog / CMS leve pra você editar sozinho", on: true },
      { t: "Integrações: WhatsApp, formulários, analytics", on: true },
      { t: "SEO on-page + Core Web Vitals no verde", on: true },
      { t: "3 rodadas de ajuste inclusas", on: true },
    ],
  },
  {
    id: "sob-medida",
    kind: "Web app",
    name: "Sob medida",
    from: "a partir de",
    price: "Sob consulta",
    isText: true,
    meta: "Escopo fechado junto com você",
    featured: false,
    ctaVariant: "ghost",
    quote:
      "Oi! Quero um orçamento de um sistema web sob medida (plano Sob medida).",
    feats: [
      { t: "Sistema completo: login, painel, pagamentos", on: true },
      { t: "Backend próprio + banco de dados", on: true },
      { t: "Integrações de API e automações", on: true },
      { t: "Escala, monitoramento e manutenção", on: true },
      { t: "A partir de R$ 6.900, conforme o escopo", on: true },
    ],
  },
];

// ── Serviços: Vídeo & Motion ─────────────────────────────────────────────────
// `fill` (0–1) alimenta a barra de timeline no topo do card = duração/porte.
export const motionTiers = [
  {
    id: "social",
    kind: "Reels · Shorts · TikTok",
    name: "Social",
    from: "a partir de",
    price: "297",
    meta: "Até 20s · entrega em ~5 dias",
    fill: 0.28,
    featured: false,
    ctaVariant: "ghost",
    quote: "Oi! Quero um orçamento de motion pra social (plano Social).",
    feats: [
      { t: "Formato vertical 9:16 pronto pro feed", on: true },
      { t: "Animação de texto + elementos gráficos", on: true },
      { t: "Trilha e SFX sincronizados", on: true },
      { t: "Legenda embutida", on: true },
      { t: "2 rodadas de ajuste inclusas", on: true },
    ],
  },
  {
    id: "explainer",
    kind: "Explainer · Promo",
    name: "Explainer",
    from: "a partir de",
    price: "797",
    meta: "Até 60s · roteiro + storyboard",
    fill: 0.62,
    featured: true,
    tag: "Mais pedido",
    ctaVariant: "primary",
    quote:
      "Oi! Quero um orçamento de um vídeo explainer/promo (plano Explainer).",
    feats: [
      { t: "Roteiro e storyboard inclusos", on: true, strong: true },
      { t: "Ilustração e personagem exclusivos", on: true },
      { t: "Narração em PT (outros idiomas à parte)", on: true },
      { t: "Color grading e sound design", on: true },
      { t: "3 rodadas de ajuste inclusas", on: true },
    ],
  },
  {
    id: "campanha",
    kind: "Campanha · Marca",
    name: "Campanha",
    from: "a partir de",
    price: "Sob consulta",
    isText: true,
    meta: "Animação complexa 2D/3D",
    fill: 1,
    featured: false,
    ctaVariant: "ghost",
    quote:
      "Oi! Quero um orçamento de uma campanha/motion de marca (plano Campanha).",
    feats: [
      { t: "Direção de arte dedicada", on: true },
      { t: "Animação complexa 2D/3D", on: true },
      { t: "Múltiplos formatos e cortes", on: true },
      { t: "Motion de marca: vinheta + kit", on: true },
      { t: "A partir de R$ 1.997, conforme o escopo", on: true },
    ],
  },
];
