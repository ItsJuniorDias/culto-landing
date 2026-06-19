import { motion, useReducedMotion } from "framer-motion";

/* Fixed full-screen film grain. Sits above everything, ignores pointer events. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="bg-noise pointer-events-none fixed inset-0 z-[80] opacity-[0.06] mix-blend-overlay"
    />
  );
}

/* Halftone dot field. Drop inside a `relative` parent. */
export function Halftone({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-dots pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-soft-light ${className}`}
    />
  );
}

/* Two blurred red gradient blooms. They breathe by default; pass `frozen` to
   render them perfectly static (the Hero uses this). Off under reduced motion. */
export function Rays({ frozen = false }) {
  const reduce = useReducedMotion();

  const common = "pointer-events-none absolute h-[60%] w-[160%] blur-lg";
  const top = {
    top: "-10%",
    left: "-30%",
    transform: "rotate(-8deg)",
    background:
      "linear-gradient(105deg,transparent 40%,rgba(225,6,0,.55) 58%,rgba(255,26,14,.25) 64%,transparent 70%)",
  };
  const bottom = {
    bottom: "-10%",
    right: "-30%",
    transform: "rotate(-8deg)",
    background:
      "linear-gradient(285deg,transparent 40%,rgba(225,6,0,.45) 58%,rgba(255,26,14,.2) 64%,transparent 70%)",
  };

  const loop = (duration) =>
    reduce || frozen
      ? {}
      : {
          animate: { opacity: [0.5, 0.95] },
          transition: {
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div className={common} style={top} {...loop(9)} />
      <motion.div
        className={`${common} blur-[10px]`}
        style={bottom}
        {...loop(11)}
      />
    </div>
  );
}

/* Radiating corner burst (engraving-style rays). `pos` = tl | tr | bl | br. */
const BURST_TRANSFORM = {
  tl: "none",
  tr: "scaleX(-1)",
  bl: "scaleY(-1)",
  br: "scale(-1,-1)",
};
const BURST_POS = {
  tl: "top-3.5 left-3.5",
  tr: "top-3.5 right-3.5",
  bl: "bottom-3.5 left-3.5",
  br: "bottom-3.5 right-3.5",
};

export function Burst({ pos = "tl", full = true }) {
  const reduce = useReducedMotion();
  const paths = full
    ? [
        "M0 0L130 28",
        "M0 0L130 0",
        "M0 0L130 64",
        "M0 0L130 110",
        "M0 0L28 130",
        "M0 0L0 130",
        "M0 0L64 130",
        "M0 0L110 130",
      ]
    : [
        "M0 0L130 28",
        "M0 0L130 0",
        "M0 0L130 64",
        "M0 0L28 130",
        "M0 0L0 130",
        "M0 0L64 130",
      ];

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 130 130"
      style={{ transform: BURST_TRANSFORM[pos] }}
      className={`pointer-events-none absolute z-[1] h-[90px] w-[90px] md:h-[130px] md:w-[130px] ${BURST_POS[pos]}`}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 0.9 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#E10600"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </motion.svg>
  );
}
