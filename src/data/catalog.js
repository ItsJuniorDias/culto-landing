// The asset packs shown in the store. Each maps to a real downloadable file in
// /public/downloads, so the download buttons actually deliver a file.
//
// Campos por pack:
//   file / fileName  → o arquivo .zip entregue no download
//   gallery          → imagens de preview na página de detalhes (opcional)
//   long             → descrição completa na página de detalhes
//   includes         → lista "o que vem dentro" (página de detalhes)
//   free             → true = sempre liberado, sem compra
//
// TROCAR ARQUIVO DE UM PACK: jogue o .zip em /public/downloads e atualize
// os campos `file` e `fileName` abaixo. Nada mais precisa mudar.

export const catalog = [
  {
    id: 'kids-space',
    title: "Kid's Learning — Space Pack",
    kind: 'Kit de marketing do app',
    desc: 'Key art principal, pôster e capa de loja do app infantil. Tema espacial com os mascotes em alta resolução, prontos pra publicar.',
    long: 'O kit de marketing completo do Kid\u2019s Learning: três versões de key art em alta resolução (espaço, fazenda e piratas) com a turma de mascotes, mais a capa de loja. Tudo em 300 dpi, pronto pra anúncio, print da loja ou pôster impresso. É o mesmo material usado nas campanhas do app.',
    includes: [
      '3 key arts temáticas (espaço · fazenda · piratas)',
      'Capa vertical pronta pra loja de apps',
      'Arquivos em PNG 300 dpi (1237 × 2200)',
      'Licença comercial inclusa',
    ],
    format: 'PNG + JPEG',
    spec: '1237 × 2200 · 300 dpi',
    size: '9,7 MB',
    items: 4,
    badges: ['PNG', 'Key art', '300 dpi'],
    thumb: '/assets/kids-learning.png',
    gallery: [
      '/assets/kids-space-01.jpg',
      '/assets/kids-space-02.jpg',
      '/assets/kids-space-03.jpg',
    ],
    file: '/downloads/kids-learning-pack.zip',
    fileName: 'kids-learning-pack.zip',
    free: true,
    price: 'Grátis',
    priceValue: 0,
  },
  {
    id: 'design',
    title: 'Design Pack',
    kind: 'Mockups · fontes · ícones',
    desc: '150 mockups editáveis em PSD, 80 fontes com licença comercial, 300 ícones e 120 templates de redes.',
    long: 'Tudo o que um designer gráfico ou social media precisa pra entregar rápido e com cara de estúdio. São 150 mockups com objeto inteligente, 80 famílias de fontes com licença comercial, 300 ícones vetoriais e 120 templates editáveis de redes sociais — organizados em pastas por categoria.',
    includes: [
      '150 mockups editáveis em PSD',
      '80 fontes com licença comercial',
      '300 ícones vetoriais (SVG)',
      '120 templates de redes sociais',
      '150 texturas e overlays em alta',
    ],
    format: 'PSD · OTF · SVG',
    spec: '650+ arquivos',
    size: '38 MB',
    items: 650,
    badges: ['PSD', 'OTF', 'SVG'],
    // TROCAR pelo arquivo real do Design Pack:
    file: '/downloads/kids-learning-pack.zip',
    fileName: 'design-pack.zip',
    free: false,
    price: 'R$ 197',
    priceValue: 197,
  },
  {
    id: 'motion',
    title: 'Motion Pack',
    kind: 'Transições · LUTs · SFX',
    desc: '120 transições, 90 LUTs de color grading, 200 SFX e 60 lower thirds para AE, Premiere e Resolve.',
    long: 'Pra editores de vídeo e motion designers que querem acelerar a timeline. 120 transições prontas, 90 LUTs de color grading testadas em material real, 200 efeitos sonoros e 60 lower thirds e intros — compatíveis com After Effects, Premiere Pro e DaVinci Resolve.',
    includes: [
      '120 transições para AE e Premiere',
      '90 LUTs de color grading (.cube)',
      '200 SFX + trilhas livres',
      '60 lower thirds, intros e outros',
      'Compatível com AE · Premiere · Resolve',
    ],
    format: 'MOGRT · CUBE · WAV',
    spec: '470+ arquivos',
    size: '120 MB',
    items: 470,
    badges: ['MOGRT', 'CUBE', 'WAV'],
    // TROCAR pelo arquivo real do Motion Pack:
    file: '/downloads/kids-learning-pack.zip',
    fileName: 'motion-pack.zip',
    free: false,
    price: 'R$ 247',
    priceValue: 247,
  },
  {
    id: 'bundle',
    title: 'Bundle Completo',
    kind: 'Tudo do catálogo',
    desc: 'Todos os 2.300+ assets de design, vídeo e motion, com atualizações vitalícias e acesso à comunidade.',
    long: 'O catálogo inteiro num só pacote, com o melhor custo por arquivo. Junta o Design Pack e o Motion Pack completos — mais de 2.300 assets — e ainda inclui as atualizações futuras sem custo, acesso à comunidade no Discord e suporte prioritário. É a opção de quem usa de tudo.',
    includes: [
      'Tudo do Design Pack + Motion Pack',
      '2.300+ assets no total',
      'Atualizações vitalícias grátis',
      'Acesso à comunidade no Discord',
      'Suporte prioritário',
    ],
    format: 'Tudo incluso',
    spec: '2.300+ arquivos',
    size: '1,4 GB',
    items: 2300,
    badges: ['Design', 'Motion', 'Updates'],
    // TROCAR pelo arquivo real do Bundle:
    file: '/downloads/kids-learning-pack.zip',
    fileName: 'bundle-completo.zip',
    free: false,
    price: 'R$ 397',
    priceValue: 397,
    featured: true,
  },
]

export const byId = (id) => catalog.find((p) => p.id === id)
export const ALL_PACK_IDS = catalog.map((p) => p.id)
export const FREE_PACK_IDS = catalog.filter((p) => p.free).map((p) => p.id)
