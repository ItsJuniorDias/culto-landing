/* Wordmark: glowing red square + blackletter "Culto". */
export default function Logo({ href = '#', size = 'text-[27px]' }) {
  return (
    <a href={href} className={`font-display inline-flex items-center gap-[11px] font-extrabold ${size}`}>
      <span aria-hidden="true" className="shadow-glow-sm h-[22px] w-[22px] flex-none bg-blood" />
      Culto
    </a>
  )
}
