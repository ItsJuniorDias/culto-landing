import Reveal from './Reveal'
import { compat } from '../data/content'

export default function Compat() {
  return (
    <div className="border-b border-line bg-pit py-7">
      <Reveal className="mx-auto flex max-w-wrap flex-wrap items-center justify-center gap-x-[30px] gap-y-3 px-6">
        <span className="font-util text-[11px] uppercase tracking-widest2 text-faint">
          Compatível com
        </span>
        {compat.map((app) => (
          <span
            key={app}
            className="font-util text-[15px] font-semibold uppercase tracking-[0.04em] text-ash transition-colors hover:text-blood"
          >
            {app}
          </span>
        ))}
      </Reveal>
    </div>
  )
}
