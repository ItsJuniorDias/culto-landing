import { Link } from 'react-router-dom'
import Logo from './Logo'
import { footerCols } from '../data/content'

/* Link do rodapé consciente de rota: caminhos internos ("/", "/sites",
   "/#packs") usam <Link> do router (navegação SPA + âncora tratada pelo
   ScrollManager); o resto ("#", links externos) cai num <a> comum. */
function FooterLink({ href, children }) {
  const cls =
    'mb-[11px] block text-sm text-ash transition-colors hover:text-blood'
  const isRoute = href.startsWith('/')
  if (isRoute) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-pit pb-9 pt-16">
      <div className="mx-auto max-w-wrap px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[36ch] text-sm text-ash">
              Assets prontos, sites sob medida e motion sob encomenda — pra quem cria imagem, vídeo
              e movimento. Feito por criador, pra criador.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.h}>
              <h4 className="font-util mb-[18px] text-[11px] uppercase tracking-[0.2em] text-faint">
                {col.h}
              </h4>
              {col.links.map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-center gap-3.5 border-y border-line py-[22px]">
          <span aria-hidden="true" className="h-px w-[60px] bg-line" />
          <span className="font-util text-[13px] uppercase tracking-[0.24em] text-ash">
            @haddadgugu
          </span>
          <span aria-hidden="true" className="h-px w-[60px] bg-line" />
        </div>

        <div className="font-util flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.1em] text-faint">
          <span>© 2026 Culto do Designer</span>
          <span>Feito no escuro, com vermelho e cafeína</span>
        </div>
      </div>
    </footer>
  )
}
