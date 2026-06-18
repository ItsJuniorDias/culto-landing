import Reveal from './Reveal'
import Button from './Button'
import { Halftone, Rays, Burst } from './Decor'

export default function FinalCta() {
  return (
    <section className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal className="relative overflow-hidden border border-line bg-[radial-gradient(110%_130%_at_50%_0%,#1b0a0c_0%,#08080A_60%)] px-8 py-[90px] text-center">
          <Halftone />
          <Rays />
          <Burst pos="tl" full={false} />
          <Burst pos="br" full={false} />

          <h2
            className="font-display relative z-[2] font-black leading-[0.9]"
            style={{ fontSize: 'clamp(44px,8vw,108px)' }}
          >
            Entre pro{' '}
            <span className="relative inline-block px-[0.1em]">
              <span
                aria-hidden="true"
                className="shadow-glow absolute inset-y-[16%] -inset-x-[2%] -z-10 bg-blood"
                style={{ transform: 'rotate(-1.5deg)' }}
              />
              Culto
            </span>
          </h2>

          <p className="relative z-[2] mx-auto mb-8 mt-6 max-w-[52ch] text-[17px] text-ash">
            Garanta o Bundle Completo com mais de 50% de desconto e tenha 2.300+ assets prontos pra
            produção ainda hoje.
          </p>

          <div className="relative z-[2] flex flex-wrap justify-center gap-3.5">
            <Button href="#packs">Garantir o Bundle ↗</Button>
            <Button href="#inside" variant="ghost">
              Ver o catálogo
            </Button>
          </div>

          <div className="font-util relative z-[2] mt-[26px] text-xs uppercase tracking-[0.14em] text-faint">
            ⟳ Garantia de 7 dias · Pagamento único · Licença comercial inclusa
          </div>
        </Reveal>
      </div>
    </section>
  )
}
