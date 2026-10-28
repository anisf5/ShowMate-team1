import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

type RevealOptions = {
  /** Vertical travel in pixels. */
  y?: number
  stagger?: number
  /** ScrollTrigger start position. */
  start?: string
  /** Delay before the first item. */
  delay?: number
}

/**
 * Reveals every [data-reveal] descendant once, staggered, as the section
 * enters the viewport. Skipped entirely when the visitor asks for less motion,
 * and content is never hidden by CSS, so a failed script leaves the page readable.
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const { y = 26, stagger = 0.08, start = 'top 84%', delay = 0 } = options

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
      if (!items.length) return

      gsap.from(items, {
        y,
        opacity: 0,
        duration: 0.9,
        delay,
        stagger,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: root, start, once: true },
      })
    }, root)

    return () => ctx.revert()
  }, [y, stagger, start, delay])

  return ref
}
