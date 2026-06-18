// Centralized motion tokens + variants.
// Keeping easing and variants in one place keeps every animation on-brand
// and makes it trivial to retune the whole site from a single file.

// easeOutExpo-ish — confident, decelerating. The signature curve of the site.
export const EASE = [0.16, 1, 0.3, 1]

export const DUR = {
  fast: 0.25,
  base: 0.6,
  slow: 0.7,
}

// Rises up + fades. Accepts an optional `custom` delay (seconds) so the same
// variant works both inside a stagger container and as a standalone reveal.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE, delay },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: DUR.base, ease: EASE, delay },
  }),
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
}

// Parent orchestrator: children with `variants` reveal in sequence.
export const staggerContainer = (staggerChildren = 0.09, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// The signature: a red bar that wipes in horizontally behind a word.
export const boxWipe = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: DUR.slow, ease: EASE, delay: 0.85 },
  },
}

// Shared viewport config for scroll reveals — fire once, a little early.
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' }
