import { Link } from 'react-router-dom'

/* Wordmark: glowing red square + blackletter "Culto". Links via router. */
export default function Logo({ to = '/', size = 'text-[27px]' }) {
  return (
    <Link to={to} className={`font-display inline-flex items-center gap-[11px] font-extrabold ${size}`}>
      <span aria-hidden="true" className="shadow-glow-sm h-[22px] w-[22px] flex-none bg-blood" />
      Culto
    </Link>
  )
}
