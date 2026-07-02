import { Link, useLocation } from 'react-router-dom'

/* Wordmark: red square + blackletter "Culto" + "DO DESIGNER".
   Asset lives in /public/assets and is served at the site root, so it's
   referenced by absolute URL (same convention as the catalog images).
   Height is controlled via `className` (defaults to h-10); width stays
   auto to preserve the logo's aspect ratio.

   Clicar no logo sempre leva ao topo do destino (`to`). Numa SPA, um
   <Link> para a rota atual não faz nada e não rola a página — por isso,
   quando já estamos na rota de destino, damos o scroll ao topo na mão
   (suave); vindo de outra página, deixamos o <Link> navegar e garantimos
   o topo instantaneamente. */
export default function Logo({ to = '/', className = 'h-10' }) {
  const { pathname } = useLocation()

  const handleClick = () => {
    const sameRoute = pathname === to
    window.scrollTo({ top: 0, behavior: sameRoute ? 'smooth' : 'auto' })
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
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
