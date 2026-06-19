import { Link } from 'react-router-dom'

/* Wordmark: red square + blackletter "Culto" + "DO DESIGNER".
   Asset lives in /public/assets and is served at the site root, so it's
   referenced by absolute URL (same convention as the catalog images).
   Height is controlled via `className` (defaults to h-10); width stays
   auto to preserve the logo's aspect ratio. */
export default function Logo({ to = '/', className = 'h-10' }) {
  return (
    <Link
      to={to}
      aria-label="Culto do Designer — início"
      className="inline-flex flex-none items-center"
    >
      <img
        src="/assets/cdd-logo.png"
        alt="Culto do Designer"
        draggable="false"
        className={`${className} w-auto select-none`}
      />
    </Link>
  )
}
