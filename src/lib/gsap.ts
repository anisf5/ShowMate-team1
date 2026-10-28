import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

export const motionQuery = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(motionQuery).matches

export { gsap, ScrollTrigger }
