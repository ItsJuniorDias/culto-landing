import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import Button from "./Button";
import { Halftone } from "./Decor";
import { reel } from "../data/content";
import { scaleIn, fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

/* Big blood play button with a glow + pulsing ring (still under reduced motion). */
function PlayButton({ reduce }) {
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center">
      <span className="relative grid h-[88px] w-[88px] place-items-center">
        {/* Pulsing ring */}
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-blood"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* Solid disc */}
        <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-blood shadow-glow transition-transform duration-300 group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            className="ml-[3px] h-7 w-7 fill-bone"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </span>
  );
}

export default function Reel() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  const embedSrc = reel.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <section
      id="reel"
      className="relative overflow-hidden py-[74px] md:py-[104px]"
    >
      <Halftone className="opacity-30" />

      <div className="relative mx-auto max-w-wrap px-6">
        <SectionHead
          center
          eyebrow="Veja em movimento"
          title={
            <>
              Não é só preview.
              <br />É a peça rodando.
            </>
          }
          lead="Um corte de um minuto com LUTs, transições e motion do pacote aplicados de verdade. O que você vê no vídeo é o que entra na sua timeline."
        />

        <Reveal
          variants={scaleIn}
          className="group relative mx-auto max-w-[960px]"
        >
          <div className="relative aspect-video overflow-hidden border border-line bg-panel shadow-featured">
            {/* Signature accent bar that wipes across the top on hover */}
            {!playing && (
              <span className="absolute left-0 top-0 z-20 h-[3px] w-0 bg-blood transition-[width] duration-500 group-hover:w-full" />
            )}

            {playing ? (
              reel.youtubeId ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedSrc}
                  title="Showreel CULTO"
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full bg-ink object-cover"
                  src={reel.src}
                  poster={reel.poster}
                  controls
                  autoPlay
                  playsInline
                />
              )
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Reproduzir o showreel"
                className="group/play absolute inset-0 h-full w-full cursor-pointer"
              >
                <img
                  src={reel.poster}
                  alt="Capa do showreel"
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                  loading="lazy"
                />
                {/* Cinematic darkening so the button reads on any frame */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50"
                />
                <PlayButton reduce={reduce} />

                {/* Duration badge */}
                {reel.duration && (
                  <span className="font-util absolute bottom-4 right-4 border border-line bg-ink/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-bone backdrop-blur-sm">
                    {reel.duration}
                  </span>
                )}
                {/* Corner label */}
                <span className="font-util absolute bottom-4 left-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone">
                  <span
                    aria-hidden="true"
                    className="h-[7px] w-[7px] animate-pulse bg-blood"
                  />
                  Showreel
                </span>
              </button>
            )}
          </div>
        </Reveal>

        {/* Spec strip */}
        <motion.ul
          className="mx-auto mt-10 grid max-w-[720px] grid-cols-3 gap-4 text-center"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={viewportOnce}
        >
          {reel.stats.map((s) => (
            <motion.li
              key={s.k}
              variants={fadeUp}
              className="border border-line bg-panel px-4 py-6"
            >
              <div className="font-display text-[40px] font-black leading-none text-transparent [-webkit-text-stroke:1.2px_#E10600]">
                {s.k}
              </div>
              <div className="font-util mt-2.5 text-[11px] uppercase tracking-[0.14em] text-ash">
                {s.v}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA de conversão — captura o interesse no pico, logo após o vídeo.
           Leva à página do Bundle (entrada do checkout), pública e sem
           barreira de login. */}
        <Reveal
          delay={0.1}
          className="mx-auto mt-[52px] max-w-[680px] text-center md:mt-16"
        >
          <p className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">
            Gostou do que viu?
          </p>
          <h3
            className="font-display mx-auto mt-3.5 max-w-[16ch] font-extrabold leading-[0.98]"
            style={{ fontSize: "clamp(26px,3.4vw,38px)" }}
          >
            Coloque esses assets na sua próxima entrega.
          </h3>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/pack/bundle" className="w-full sm:w-auto">
              Quero o Bundle completo ↗
            </Button>
            <Button href="#packs" variant="ghost" className="w-full sm:w-auto">
              Ver todos os packs
            </Button>
          </div>

          <p className="font-util mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-faint">
            <span>Pagamento único</span>
            <span aria-hidden="true" className="h-[3px] w-[3px] bg-blood" />
            <span>Pix, cartão ou boleto</span>
            <span aria-hidden="true" className="h-[3px] w-[3px] bg-blood" />
            <span>7 dias de garantia</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
