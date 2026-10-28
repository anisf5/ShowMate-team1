import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap'

/**
 * Counts a figure up once when it scrolls into view. With reduced motion the
 * final value is written immediately.
 */
export function useCounter(value: number, suffix = '', animate = true) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const render = (n: number) => {
      el.textContent = `${Math.round(n)}${suffix}`
    }

    if (!animate || prefersReducedMotion()) {
      render(value)
      return
    }

    const counter = { n: 0 }
    render(0)

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: value,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => render(counter.n),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [value, suffix, animate])

  return ref
}
