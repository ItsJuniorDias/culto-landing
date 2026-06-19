import { motion, useScroll, useTransform } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import CountUp from "./CountUp";
import { Halftone, Rays } from "./Decor";
import { EASE, fadeUp } from "../lib/motion";
import { useHeroParallax } from "../lib/useHeroParallax";

// Each stat carries everything CountUp needs to render its final string,
// so "2.300+", "18 mil" and "4,9★" animate while keeping their formatting.
const stats = [
  { to: 2300, separator: ".", suffix: "+", lbl: "Assets prontos" },
  { to: 18, suffix: " mil", lbl: "Criadores" },
  { to: 4.9, decimals: 1, suffix: "★", lbl: "Nota média" },
];

// Orchestrates the stats row: the block rises in, then each figure reveals
// in sequence. Tuned to pick up where the rest of the hero load sequence ends.
const statsContainer = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
      delay: 0.7,
      delayChildren: 0.9,
      staggerChildren: 0.12,
    },
  },
};

// Sum helper for combining a pointer offset and a scroll offset on the same axis.
const add = ([a, b]) => a + b;

export default function Hero() {
  // Pointer / tilt tracking. px,py ≈ -0.5..0.5 from center, drives the text planes.
  const { ref, px, py, reduce } = useHeroParallax();

  // Scroll progress across the hero: 0 at rest, 1 once it has scrolled fully
  // out the top. Drives the cinematic "depth exit" as the section leaves.
  const { scrollYProgress: sp } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // On-mount rise with a staggered delay. Returns {} under reduced motion.
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  // ── Depth planes ──────────────────────────────────────────────────────────
  // The atmosphere (Plane 1) is now a static backdrop. The text planes below
  // still drift: back planes move OPPOSITE the cursor, foreground planes WITH it.

  // Plane 2 — oversized "assets" outline word: drifts opposite, zooms through.
  const wordX = useTransform(px, [-0.5, 0.5], [44, -44]);
  const wordYp = useTransform(py, [-0.5, 0.5], [26, -26]);
  const wordYs = useTransform(sp, [0, 1], [0, -170]);
  const wordY = useTransform([wordYp, wordYs], add);
  const wordScale = useTransform(sp, [0, 1], [1, 1.18]);
  const wordOpacity = useTransform(sp, [0, 0.55], [1, 0]);

  // Plane 4 — title "Baixe & Crie": floats with cursor + tilts in 3D, lingers
  // the longest as the hero dissolves so it's the last thing to leave.
  const titleX = useTransform(px, [-0.5, 0.5], [-14, 14]);
  const titleYp = useTransform(py, [-0.5, 0.5], [-9, 9]);
  const titleYs = useTransform(sp, [0, 1], [0, -55]);
  const titleY = useTransform([titleYp, titleYs], add);
  const titleRotY = useTransform(px, [-0.5, 0.5], [-7, 7]);
  const titleRotX = useTransform(py, [-0.5, 0.5], [6, -6]);
  const titleScale = useTransform(sp, [0, 1], [1, 0.9]);
  const titleOpacity = useTransform(sp, [0, 0.92], [1, 0]);

  // Plane 5 — supporting copy (eyebrow, paragraph, CTAs, stats): the nearest
  // text plane, smallest drift so it stays comfortable to read and click.
  const copyX = useTransform(px, [-0.5, 0.5], [-7, 7]);
  const copyYp = useTransform(py, [-0.5, 0.5], [-5, 5]);
  const copyYs = useTransform(sp, [0, 1], [0, -34]);
  const copyY = useTransform([copyYp, copyYs], add);
  const copyOpacity = useTransform(sp, [0, 0.6], [1, 0]);

  // Reusable style object for the supporting-copy plane.
  const copyPlane = reduce
    ? undefined
    : { x: copyX, y: copyY, opacity: copyOpacity };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_18%,#19181d_0%,#08080A_62%)]"
    >
      {/* Plane 1 — atmosphere (static backdrop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <Halftone />
        <Rays frozen />
      </div>

      <div className="relative z-[2] mx-auto max-w-[920px] px-6 pb-[84px] pt-[96px] text-center">
        {/* Plane 2 — oversized outline word behind the title.
            Outer node centers it; inner motion node carries the parallax so
            the -50% centering isn't overwritten by the transform. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[4%] z-0 -translate-x-1/2"
        >
          <motion.div
            style={
              reduce
                ? undefined
                : { x: wordX, y: wordY, scale: wordScale, opacity: wordOpacity }
            }
          >
            <span
              className="font-display block select-none whitespace-nowrap font-bold leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(236,232,224,0.07)]"
              style={{ fontSize: "clamp(60px,16vw,190px)" }}
            >
              assets
            </span>
          </motion.div>
        </div>

        {/* Plane 5 — eyebrow */}
        <motion.div style={copyPlane} className="relative z-[2] mb-[26px]">
          <motion.div {...rise(0.1)}>
            <Eyebrow solo>2.300+ assets · licença comercial</Eyebrow>
          </motion.div>
        </motion.div>

        {/* Plane 4 — title (3D-tilting plane) */}
        <motion.div
          className="relative z-[2]"
          style={
            reduce
              ? undefined
              : {
                  x: titleX,
                  y: titleY,
                  scale: titleScale,
                  opacity: titleOpacity,
                  rotateX: titleRotX,
                  rotateY: titleRotY,
                  transformPerspective: 1000,
                }
          }
        >
          <h1
            className="font-display font-black leading-[0.86]"
            style={{ fontSize: "clamp(58px,14vw,150px)" }}
          >
            <motion.span {...rise(0.2)} className="block">
              Baixe
            </motion.span>
            <motion.span {...rise(0.32)} className="block">
              <span className="relative inline-block px-[0.12em] text-bone">
                <motion.span
                  aria-hidden="true"
                  className="shadow-glow absolute inset-y-[14%] -inset-x-[2%] -z-10 bg-blood"
                  style={{ originX: 0, rotate: -1.5 }}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={reduce ? undefined : { scaleX: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
                />
                &amp;
              </span>{" "}
              Crie
            </motion.span>
          </h1>
        </motion.div>

        {/* Plane 5 — paragraph */}
        <motion.div style={copyPlane} className="relative z-[2]">
          <motion.p
            {...rise(0.45)}
            className="mx-auto mb-9 mt-[30px] max-w-[50ch] text-[18px] text-ash"
          >
            Packs prontos de design, vídeo e motion: LUTs, transições, mockups,
            fontes, SFX e templates de After Effects. Você baixa, arrasta e
            entrega — sem perder horas garimpando arquivo solto.
          </motion.p>
        </motion.div>

        {/* Plane 5 — CTAs */}
        <motion.div style={copyPlane} className="relative z-[2]">
          <motion.div
            {...rise(0.55)}
            className="flex flex-wrap justify-center gap-3.5"
          >
            <Button href="#packs">Comprar agora ↗</Button>
            <Button href="#inside" variant="ghost">
              Ver o catálogo
            </Button>
          </motion.div>
        </motion.div>

        {/* Plane 5 — stats */}
        <motion.div style={copyPlane} className="relative z-[2]">
          <motion.div
            className="mt-[54px] flex flex-wrap justify-center gap-x-12 gap-y-8 border-t border-line pt-[34px]"
            variants={reduce ? undefined : statsContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "show"}
          >
            {stats.map((s, i) => (
              <motion.div key={s.lbl} variants={reduce ? undefined : fadeUp}>
                <div className="font-display text-[40px] font-extrabold leading-none">
                  <CountUp
                    to={s.to}
                    decimals={s.decimals}
                    separator={s.separator}
                    suffix={s.suffix}
                    delay={reduce ? 0 : 1.05 + i * 0.12}
                  />
                </div>
                <div className="font-util mt-2 text-[11px] uppercase tracking-[0.2em] text-faint">
                  {s.lbl}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
