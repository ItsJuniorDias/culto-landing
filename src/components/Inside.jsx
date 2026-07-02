import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import CountUp from './CountUp'
import { Halftone } from './Decor'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/* ── Vetores das categorias ───────────────────────────────────────────────
   Cada glyph guarda só a geometria (paths + shapes extras), sem tamanho fixo,
   pra ser reaproveitado em escalas diferentes: grande e nítido no centro da
   capa, e gigante/apagado como marca-d'água ao fundo. */
function Glyph({ glyph, className = '', strokeWidth = 1.6 }) {
  const { paths = [], extra = null, viewBox = '0 0 24 24' } = glyph
  return (
    <svg viewBox={viewBox} className={className} strokeWidth={strokeWidth} aria-hidden="true">
      {paths.map((p) => (
        <path key={p} d={p} />
      ))}
      {extra}
    </svg>
  )
}

const categories = [
  {
    title: 'LUTs & color grading',
    text: 'Presets de cor cinematográficos para Resolve, Premiere e Final Cut. Do look quente de filme ao teal & orange.',
    count: '90 LUTs',
    ext: '.cube .lut',
    glyph: { paths: ['M12 3v18M3 12h18'], extra: <circle cx="12" cy="12" r="9" /> },
  },
  {
    title: 'Transições & motion',
    text: 'Transições suaves, glitch, zoom e luz feitas pra arrastar na timeline. Compatíveis com AE e Premiere.',
    count: '120 transições',
    ext: '.mogrt .aep',
    glyph: { paths: ['M3 12h4l3 7 4-14 3 7h4'] },
  },
  {
    title: 'Mockups editáveis',
    text: 'Cenas em PSD com objetos inteligentes: telas, embalagens, papelaria e displays prontos pra trocar sua arte.',
    count: '150 mockups',
    ext: '.psd',
    glyph: { paths: ['M3 9h18'], extra: <rect x="3" y="5" width="18" height="14" rx="1" /> },
  },
  {
    title: 'Fontes & tipografia',
    text: 'Famílias display e de texto com licença comercial. Variáveis, com pesos e estilos prontos pra usar.',
    count: '80 fontes',
    ext: '.otf .ttf',
    glyph: { paths: ['M4 20V4h16M4 12h10'] },
  },
  {
    title: 'SFX & trilhas',
    text: 'Foley, whooshes, impactos e loops de trilha livres de direitos. Tudo já normalizado e nomeado.',
    count: '200 sons',
    ext: '.wav .mp3',
    glyph: { paths: ['M3 18s3-2 9-2 9 2 9 2M3 6s3 2 9 2 9-2 9-2v12'] },
  },
  {
    title: 'Ícones & vetores',
    text: 'Coleções consistentes em traço e preenchido. SVG editável, organizados por tema e prontos pro Figma.',
    count: '300 ícones',
    ext: '.svg',
    glyph: {
      extra: (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
        </>
      ),
    },
  },
  {
    title: 'Texturas & overlays',
    text: 'Grãos de filme, vazamentos de luz, papel e ruído. Em alta resolução pra dar textura sem pesar o projeto.',
    count: '150 texturas',
    ext: '.jpg .mov',
    glyph: { paths: ['M4 16l5-5 4 4 7-7M4 20h16'] },
  },
  {
    title: 'Templates de redes',
    text: 'Posts, stories e capas editáveis em Figma e PSD. Grades prontas pra adaptar a marca em minutos.',
    count: '120 templates',
    ext: '.fig .psd',
    glyph: { paths: ['M9 20h6M3 9h18'], extra: <rect x="3" y="4" width="18" height="14" rx="1" /> },
  },
  {
    title: 'Lower thirds & intros',
    text: 'Aberturas, créditos e legendas animadas prontas pra entrar no seu projeto e só trocar o texto.',
    count: '60 cenas',
    ext: '.aep .mogrt',
    glyph: { paths: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 12v9M4 7.5l8 4.5 8-4.5'] },
  },
]

/* Capa do card: banner texturizado com o vetor da categoria em destaque.
   Camadas (de trás pra frente): gradiente escuro com leve brilho blood no
   topo → halftone → marca-d'água gigante do próprio vetor → glow suave →
   vetor nítido centralizado. Um selo com a extensão fica no canto. */
function Cover({ glyph, ext }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-[radial-gradient(120%_130%_at_50%_-20%,#1b1016_0%,#100e13_46%,#0b0a0d_100%)]">
      <Halftone className="opacity-40" />

      {/* marca-d'água: o mesmo vetor, gigante e apagado, pra dar profundidade */}
      <Glyph
        glyph={glyph}
        strokeWidth={0.85}
        className="pointer-events-none absolute -bottom-9 -right-8 h-[168px] w-[168px] rotate-[8deg] fill-none stroke-blood/[0.08]"
      />

      {/* glow suave atrás do vetor principal */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/10 blur-2xl transition-opacity duration-300 group-hover:bg-blood/20"
      />

      {/* vetor principal, nítido e centralizado */}
      <span className="absolute inset-0 grid place-items-center">
        <Glyph
          glyph={glyph}
          className="h-[62px] w-[62px] fill-none stroke-blood transition-transform duration-300 group-hover:scale-[1.08]"
        />
      </span>

      {/* selo de formato */}
      <span className="font-util absolute right-3 top-3 border border-line bg-ink/70 px-2 py-[5px] text-[10px] uppercase tracking-[0.12em] text-blood backdrop-blur-sm">
        {ext}
      </span>

      {/* barra de destaque que preenche no hover (assinatura do site) */}
      <span className="absolute left-0 top-0 z-10 h-[3px] w-0 bg-blood transition-[width] duration-500 group-hover:w-full" />
    </div>
  )
}

function CategoryCard({ category }) {
  const reduce = useReducedMotion()
  // "90 LUTs" -> anima o 90 e mantém a unidade fixa.
  const [, n, unit] = category.count.match(/^(\d+)\s+(.+)$/) || [, null, category.count]

  return (
    <motion.article
      variants={fadeUp}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden border border-line bg-panel transition-colors hover:border-blood hover:bg-panel-2"
    >
      <Cover glyph={category.glyph} ext={category.ext} />

      <div className="flex flex-1 flex-col p-[26px]">
        <h3 className="font-display mb-2 text-[23px] font-bold leading-tight">{category.title}</h3>
        <p className="text-[14.5px] text-ash">{category.text}</p>

        <div className="font-util mt-5 border-t border-line pt-4 text-[11px] uppercase tracking-[0.12em] text-bone">
          {n ? <CountUp to={Number(n)} suffix={` ${unit}`} duration={1.2} /> : category.count}{' '}
          <span className="text-faint">inclusos</span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Inside() {
  const reduce = useReducedMotion()

  return (
    <section id="inside" className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          eyebrow="O que vem dentro"
          title={
            <>
              Tudo que um projeto
              <br />
              pede, num lugar só.
            </>
          }
          lead="Cada categoria é curada à mão, nomeada de forma clara e organizada em pastas que fazem sentido. Nada de arquivo solto ou preview de baixa resolução."
        />

        <motion.div
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3"
          variants={staggerContainer(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {categories.map((c) => (
            <CategoryCard key={c.title} category={c} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
