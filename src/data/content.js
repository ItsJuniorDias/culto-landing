// Site content kept separate from layout so copy is easy to edit in one place.

export const compat = [
  'After Effects',
  'Premiere Pro',
  'DaVinci Resolve',
  'Final Cut',
  'Photoshop',
  'Illustrator',
  'Figma',
  'Blender',
]

export const packs = [
  {
    id: 'design',
    kind: 'Design',
    name: 'Design Pack',
    desc: 'Para designers gráficos e social media.',
    price: '197',
    old: 'R$ 390',
    cta: 'Comprar Design Pack',
    ctaVariant: 'ghost',
    featured: false,
    feats: [
      { t: '150 mockups editáveis em PSD', on: true },
      { t: '80 fontes com licença comercial', on: true },
      { t: '300 ícones + 120 templates de redes', on: true },
      { t: '150 texturas e overlays em alta', on: true },
      { t: 'Assets de vídeo e motion', on: false },
    ],
  },
  {
    id: 'bundle',
    kind: 'Design + Vídeo + Motion',
    name: 'Bundle Completo',
    desc: 'Todo o catálogo, com desconto e updates vitalícios.',
    price: '397',
    old: 'R$ 880',
    cta: 'Quero o Bundle ↗',
    ctaVariant: 'primary',
    featured: true,
    tag: 'Mais vendido',
    feats: [
      { t: 'Tudo do Design + Motion Pack', on: true, strong: true },
      { t: '2.300+ assets no total', on: true },
      { t: 'Atualizações vitalícias grátis', on: true },
      { t: 'Acesso à comunidade no Discord', on: true },
      { t: 'Suporte prioritário', on: true },
    ],
  },
  {
    id: 'motion',
    kind: 'Vídeo + Motion',
    name: 'Motion Pack',
    desc: 'Para editores de vídeo e motion designers.',
    price: '247',
    old: 'R$ 490',
    cta: 'Comprar Motion Pack',
    ctaVariant: 'ghost',
    featured: false,
    feats: [
      { t: '120 transições para AE e Premiere', on: true },
      { t: '90 LUTs de color grading', on: true },
      { t: '200 SFX + trilhas livres', on: true },
      { t: '60 lower thirds, intros e outros', on: true },
      { t: 'Mockups e fontes de design', on: false },
    ],
  },
]

export const steps = [
  {
    n: '01',
    title: 'Escolha o pack',
    text: 'Selecione o pack que combina com o seu trabalho. Pagamento único, no Pix ou cartão, sem mensalidade.',
  },
  {
    n: '02',
    title: 'Baixe na hora',
    text: 'O link de download chega no seu e-mail na hora da compra. Tudo já organizado em pastas por categoria.',
  },
  {
    n: '03',
    title: 'Arraste e crie',
    text: 'Importe direto no seu editor favorito, arraste pra timeline ou pra arte e entregue o projeto mais rápido.',
  },
]

export const voices = [
  {
    text: 'As LUTs salvaram minha vida no color. Apliquei, ajustei um pouco e o look ficou pronto. Entreguei um clipe inteiro na metade do tempo.',
    name: 'Rafael Mendes',
    role: 'Editor de vídeo · SP',
    av: 'linear-gradient(135deg,#E10600,#2a0200)',
  },
  {
    text: 'Os mockups são absurdos de bons. Objeto inteligente certinho, sombra realista. Uso em quase toda proposta que mando pra cliente.',
    name: 'Camila Duarte',
    role: 'Designer gráfica · RJ',
    av: 'linear-gradient(135deg,#2a0200,#E10600)',
  },
  {
    text: 'O Bundle paga o investimento no primeiro freela. As transições e os lower thirds deixam tudo com cara de estúdio grande.',
    name: 'Lucas Ferreira',
    role: 'Motion designer · BH',
    av: 'linear-gradient(135deg,#FF1A0E,#1a0100)',
  },
]

export const faqs = [
  {
    q: 'Posso usar os assets em trabalhos de clientes?',
    a: 'Sim. Todos os packs vêm com licença comercial, então você pode usar em projetos pagos, de clientes e em peças comerciais. O que não é permitido é revender os arquivos como se fossem seus.',
  },
  {
    q: 'É pagamento único ou assinatura?',
    a: 'Pagamento único. Você compra uma vez e fica com os arquivos para sempre, sem mensalidade. No Bundle Completo, as atualizações futuras também são incluídas sem custo extra.',
  },
  {
    q: 'Em quais programas os assets funcionam?',
    a: 'After Effects, Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, Illustrator, Figma e Blender, dependendo da categoria. Cada arquivo indica claramente o formato e o software recomendado.',
  },
  {
    q: 'Como recebo os arquivos depois de pagar?',
    a: 'O link de download é liberado na hora e enviado para o seu e-mail. São arquivos em alta resolução, organizados em pastas por categoria, prontos para importar.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias de garantia. Se os packs não fizerem sentido pro seu trabalho, é só pedir o reembolso por e-mail e devolvemos o valor integral, sem perguntas.',
  },
]

export const footerCols = [
  {
    h: 'Produto',
    links: [
      { label: 'Design Pack', href: '#packs' },
      { label: 'Motion Pack', href: '#packs' },
      { label: 'Bundle Completo', href: '#packs' },
      { label: 'Catálogo', href: '#inside' },
    ],
  },
  {
    h: 'Marca',
    links: [
      { label: 'Sobre', href: '#' },
      { label: 'Depoimentos', href: '#voices' },
      { label: 'Dúvidas', href: '#faq' },
      { label: 'Afiliados', href: '#' },
    ],
  },
  {
    h: 'Suporte',
    links: [
      { label: 'Contato', href: '#' },
      { label: 'Licença de uso', href: '#' },
      { label: 'Reembolso', href: '#' },
      { label: 'Termos & privacidade', href: '#' },
    ],
  },
]

export const navLinks = [
  { label: 'Packs', href: '#packs' },
  { label: 'O que vem', href: '#inside' },
  { label: 'Quem usa', href: '#voices' },
  { label: 'Dúvidas', href: '#faq' },
]
