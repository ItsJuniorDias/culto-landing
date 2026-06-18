import { Burst } from './Decor'

/* On-brand poster tile used as a thumbnail when a pack has no photo. */
export default function PosterTile({ title, format }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_50%_-10%,#1f0b0d,#0d0a0c_72%)]">
      <Burst pos="tl" full={false} />
      <Burst pos="br" full={false} />
      <div className="relative z-[2] px-5 text-center">
        <span aria-hidden="true" className="shadow-glow-sm mx-auto mb-3 block h-5 w-5 bg-blood" />
        <div className="font-display text-2xl font-extrabold leading-none text-bone">{title}</div>
        <div className="font-util mt-2 text-[10px] uppercase tracking-[0.24em] text-blood">
          {format}
        </div>
      </div>
    </div>
  )
}
