import { motion, useReducedMotion } from 'framer-motion'
import Button from './Button'
import PosterTile from './PosterTile'
import { useAuth } from '../context/AuthContext'
import { downloadFile } from '../lib/download'
import { fadeUp } from '../lib/motion'

export default function AssetCard({ pack }) {
  const reduce = useReducedMotion()
  const { ownsPack, purchase, recordDownload, downloads } = useAuth()
  const owned = ownsPack(pack.id)
  const count = downloads[pack.id] || 0

  const handleDownload = () => {
    downloadFile(pack.file, pack.fileName)
    recordDownload(pack.id)
  }

  return (
    <motion.article
      variants={fadeUp}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden border border-line bg-panel transition-colors hover:border-blood"
    >
      {/* thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {pack.thumb ? (
          <img
            src={pack.thumb}
            alt={pack.title}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <PosterTile title={pack.title.split('—').pop().trim()} format={pack.format} />
        )}

        <span
          className={`font-util absolute left-0 top-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
            owned ? 'bg-blood text-bone' : 'bg-ink/85 text-ash backdrop-blur-sm'
          }`}
        >
          {owned ? 'Na biblioteca' : pack.price}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6">
        <span className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">{pack.kind}</span>
        <h3 className="font-display mt-1.5 text-2xl font-extrabold leading-none">{pack.title}</h3>
        <p className="mt-3 text-[14px] text-ash">{pack.desc}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {pack.badges.map((b) => (
            <span
              key={b}
              className="font-util border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ash"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="font-util mt-4 text-[11px] uppercase tracking-[0.1em] text-faint">
          {pack.spec} · {pack.size}
        </div>

        <div className="mt-auto pt-6">
          {owned ? (
            <>
              <Button as="button" full onClick={handleDownload}>
                Baixar pack ↓
              </Button>
              <p className="font-util mt-2.5 text-center text-[10px] uppercase tracking-[0.16em] text-faint">
                {count > 0 ? `${count} ${count === 1 ? 'download' : 'downloads'}` : 'Pronto pra baixar'}
              </p>
            </>
          ) : (
            <>
              <Button as="button" full variant="ghost" onClick={() => purchase(pack.id)}>
                Desbloquear · {pack.price}
              </Button>
              <p className="font-util mt-2.5 text-center text-[10px] uppercase tracking-[0.16em] text-faint">
                Compra simulada · sem cobrança
              </p>
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}
