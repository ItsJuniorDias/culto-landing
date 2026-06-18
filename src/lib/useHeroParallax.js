import { useEffect, useRef } from 'react'
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

// Pointer + device-tilt parallax tracker for the hero diorama.
//
// Exposes spring-smoothed values so every dependent layer eases instead of
// snapping:
//   px / py — normalized pointer offset from the element's center (~ -0.5..0.5),
//             the input that drives the depth planes.
//   gx / gy — raw cursor coordinates in px from the element's top-left,
//             used to position the red light that tracks the cursor.
//   glow    — 0..1, fades the cursor light in only while a real pointer hovers.
//
// On touch devices the same px/py space is fed by the gyroscope, so the scene
// tilts when you tilt the phone. Everything no-ops under reduced motion.
export function useHeroParallax() {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  const pxRaw = useMotionValue(0)
  const pyRaw = useMotionValue(0)
  const gxRaw = useMotionValue(0)
  const gyRaw = useMotionValue(0)
  const glow = useMotionValue(0)

  // Two feels: a tighter spring for the depth planes, a looser one for the
  // light so it trails a beat behind the cursor like a real torch.
  const plane = { stiffness: 70, damping: 22, mass: 0.6 }
  const torch = { stiffness: 45, damping: 18, mass: 0.9 }

  const px = useSpring(pxRaw, plane)
  const py = useSpring(pyRaw, plane)
  const gx = useSpring(gxRaw, torch)
  const gy = useSpring(gyRaw, torch)

  useEffect(() => {
    const el = ref.current
    if (reduce || !el) return

    const clamp = (v) => Math.max(-0.5, Math.min(0.5, v))
    let frame = 0

    const apply = (clientX, clientY) => {
      const r = el.getBoundingClientRect()
      pxRaw.set(clamp((clientX - (r.left + r.width / 2)) / r.width))
      pyRaw.set(clamp((clientY - (r.top + r.height / 2)) / r.height))
      gxRaw.set(clientX - r.left)
      gyRaw.set(clientY - r.top)
      glow.set(1)
    }

    // Coalesce rapid pointer events into one read per frame.
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => apply(e.clientX, e.clientY))
    }

    // Ease everything back to rest and park the light in the center.
    const onLeave = () => {
      const r = el.getBoundingClientRect()
      pxRaw.set(0)
      pyRaw.set(0)
      gxRaw.set(r.width / 2)
      gyRaw.set(r.height / 2)
      glow.set(0)
    }

    // Mobile: map device tilt into the same normalized space.
    // gamma ≈ left/right (-45..45), beta ≈ front/back, recentred around 45°.
    const onTilt = (e) => {
      if (e.gamma == null || e.beta == null) return
      pxRaw.set(clamp(e.gamma / 45))
      pyRaw.set(clamp((e.beta - 45) / 45))
    }

    // Park the light in the center until the first hover.
    const r0 = el.getBoundingClientRect()
    gxRaw.set(r0.width / 2)
    gyRaw.set(r0.height / 2)

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [reduce, pxRaw, pyRaw, gxRaw, gyRaw, glow])

  return { ref, px, py, gx, gy, glow, reduce }
}
