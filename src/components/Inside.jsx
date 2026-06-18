import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/* Inline icon set. Each is a 24x24 stroke glyph matching its category. */
const Icon = ({ d, extra }) => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-blood" strokeWidth="1.6">
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
    {extra}
  </svg>
)

const categories = [
  {
    title: 'LUTs & color grading',
    text: 'Presets de cor cinematográficos para Resolve, Premiere e Final Cut. Do look quente de filme ao teal & orange.',
    count: '90 LUTs',
    ext: '.cube .lut',
    icon: <Icon d={['M12 3v18M3 12h18']} extra={<circle cx="12" cy="12" r="9" />} />,
  },
  {
    title: 'Transições & motion',
    text: 'Transições suaves, glitch, zoom e luz feitas pra arrastar na timeline. Compatíveis com AE e Premiere.',
    count: '120 transições',
    ext: '.mogrt .aep',
    icon: <Icon d={['M3 12h4l3 7 4-14 3 7h4']} />,
  },
  {
    title: 'Mockups editáveis',
    text: 'Cenas em PSD com objetos inteligentes: telas, embalagens, papelaria e displays prontos pra trocar sua arte.',
    count: '150 mockups',
    ext: '.psd',
    icon: <Icon d={['M3 9h18']} extra={<rect x="3" y="5" width="18" height="14" rx="1" />} />,
  },
  {
    title: 'Fontes & tipografia',
    text: 'Famílias display e de texto com licença comercial. Variáveis, com pesos e estilos prontos pra usar.',
    count: '80 fontes',
    ext: '.otf .ttf',
    icon: <Icon d={['M4 20V4h16M4 12h10']} />,
  },
  {
    title: 'SFX & trilhas',
    text: 'Foley, whooshes, impactos e loops de trilha livres de direitos. Tudo já normalizado e nomeado.',
    count: '200 sons',
    ext: '.wav .mp3',
    icon: <Icon d={['M3 18s3-2 9-2 9 2 9 2M3 6s3 2 9 2 9-2 9-2v12']} />,
  },
  {
    title: 'Ícones & vetores',
    text: 'Coleções consistentes em traço e preenchido. SVG editável, organizados por tema e prontos pro Figma.',
    count: '300 ícones',
    ext: '.svg',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-blood" strokeWidth="1.6">
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </svg>
    ),
  },
  {
    title: 'Texturas & overlays',
    text: 'Grãos de filme, vazamentos de luz, papel e ruído. Em alta resolução pra dar textura sem pesar o projeto.',
    count: '150 texturas',
    ext: '.jpg .mov',
    icon: <Icon d={['M4 16l5-5 4 4 7-7M4 20h16']} />,
  },
  {
    title: 'Templates de redes',
    text: 'Posts, stories e capas editáveis em Figma e PSD. Grades prontas pra adaptar a marca em minutos.',
    count: '120 templates',
    ext: '.fig .psd',
    icon: <Icon d={['M9 20h6M3 9h18']} extra={<rect x="3" y="4" width="18" height="14" rx="1" />} />,
  },
  {
    title: 'Lower thirds & intros',
    text: 'Aberturas, créditos e legendas animadas prontas pra entrar no seu projeto e só trocar o texto.',
    count: '60 cenas',
    ext: '.aep .mogrt',
    icon: <Icon d={['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 12v9M4 7.5l8 4.5 8-4.5']} />,
  },
]

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
            <motion.article
              key={c.title}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="group relative overflow-hidden border border-line bg-panel p-[26px] transition-colors hover:border-blood hover:bg-panel-2"
            >
              {/* Top accent that grows on hover */}
              <span className="absolute left-0 top-0 h-[3px] w-0 bg-blood transition-[width] duration-300 group-hover:w-full" />
              <div className="mb-[18px] grid h-11 w-11 place-items-center border border-line bg-ink">
                {c.icon}
              </div>
              <h3 className="font-display mb-2 text-[23px] font-bold">{c.title}</h3>
              <p className="text-[14.5px] text-ash">{c.text}</p>
              <div className="font-util mt-4 text-[11px] uppercase tracking-[0.12em] text-bone">
                {c.count} · <b className="font-semibold text-blood">{c.ext}</b>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
