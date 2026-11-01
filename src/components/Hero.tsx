import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'

import { site } from '../data/site'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(
          '.hero-title',
          { yPercent: 108, opacity: 0, duration: 1.05, ease: 'power4.out' },
          0.06,
        )
        .from('.hero-tagline', { y: 24, opacity: 0, duration: 0.7 }, 0.5)
        .from('.hero-sub', { y: 18, opacity: 0, duration: 0.6 }, 0.6)
        .from('.hero-secondary', { y: 12, opacity: 0, duration: 0.5 }, 0.72)
        .from('.hero-cta > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.58)
        .from('.hero-foot', { opacity: 0, y: 10, duration: 0.5 }, 0.85)

      /* the signature move: the photograph opens from an edge */
      gsap.fromTo(
        '.hero-photo-a',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.15,
          ease: 'power4.inOut',
          delay: 0.12,
        },
      )
      gsap.fromTo(
        '.hero-photo-a img',
        { scale: 1.14 },
        { scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.12 },
      )
      gsap.from('.hero-photo-b', { opacity: 0, duration: 0.9, delay: 0.5 })

      /* restrained parallax, desktop only */
      const mm = gsap.matchMedia()
      mm.add('(min-width: 901px)', () => {
        gsap.to('.hero-grid', {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-orb', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-photo-a img', {
          scale: 1.09,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="home" aria-labelledby="hero-title" ref={rootRef}>
      <div className="hero-board">
        <div className="hero-name tile">
          <svg className="hero-grid" aria-hidden="true" focusable="false">
            <defs>
              <pattern id="hero-grid-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M56 0H0V56" fill="none" stroke="rgba(57,255,20,0.14)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
          </svg>

          <svg className="hero-orb" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#39FF14" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#00C853" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="198" fill="url(#orb-core)" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(57,255,20,0.22)" strokeWidth="1" />
            <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(57,255,20,0.12)" strokeWidth="1" />
          </svg>

          <h1 className="hero-title" id="hero-title" aria-label="Showmate — the Shellmates archive">
            <span className="hero-line" aria-hidden="true">
              SHOW
            </span>
            <span className="hero-line accent" aria-hidden="true">
              MATE
            </span>
          </h1>

          <div className="hero-foot">
            <p className="hero-status">Shellmates // ESI Algiers</p>
            <a className="hero-scroll" href="#projects">
              <ArrowDown size={14} aria-hidden="true" />
              Scroll the archive
            </a>
            <span className="live">system online</span>
          </div>
        </div>

        <div className="hero-photo-a photo-tile tile">
          <img
            src="/assets/club/pair-laptop.jpg"
            width={921}
            height={1206}
            alt="Two students leaning over a laptop together during a club session."
            fetchPriority="high"
            decoding="async"
          />
          <span className="photo-cap">Working session, members</span>
        </div>

        <div className="hero-statement tile">
          <div>
            <p className="hero-tagline">{site.tagline}</p>
            <p className="hero-sub">
              A student cybersecurity club at the National Higher School of Computer Science in
              Algiers. Founded in 2011 under the name OWASP.
            </p>
          </div>
          <a className="hero-secondary" href="#about">
            Meet Shellmates
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <a className="hero-cta tile" href="#projects">
          <span className="meta">Shellmates // ESI Algiers</span>
          <span className="hero-cta-link">
            <strong>Explore Projects</strong>
            <ArrowUpRight size={30} aria-hidden="true" />
          </span>
        </a>

        <div className="hero-photo-b photo-tile tile">
          <img
            src="/assets/club/group-outside.jpg"
            width={809}
            height={507}
            alt="A large group of students posing outdoors beside a green Shellmates banner."
            decoding="async"
          />
          <span className="photo-cap">Members, group photograph</span>
        </div>
      </div>
    </section>
  )
}
