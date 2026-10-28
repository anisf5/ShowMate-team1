import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'

import { site } from '../data/site'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import CommandPalette from './CommandPalette'
import ShellMark from './ShellMark'

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const firstMenuLink = useRef<HTMLAnchorElement>(null)

  /* solid navigation once the page has moved */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* active section indicator */
  useEffect(() => {
    if (!isHome) return
    const sections = site.nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  /* command palette shortcut */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* close the phone menu on navigation */
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  /* phone menu: lock scroll, focus, escape, entrance */
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMenuLink.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen || prefersReducedMotion()) return
    const menu = menuRef.current
    if (!menu) return

    const ctx = gsap.context(() => {
      gsap.from('.menu-link', {
        yPercent: 50,
        opacity: 0,
        duration: 0.55,
        stagger: 0.055,
        ease: 'power3.out',
      })
      gsap.from('.menu-foot', { opacity: 0, y: 12, duration: 0.4, delay: 0.24 })
    }, menu)

    return () => ctx.revert()
  }, [menuOpen])

  const currentSection = isHome ? active : ''

  return (
    <>
      <header className={`nav${stuck || menuOpen ? ' is-stuck' : ''}`}>
        <div className="nav-inner">
          <Link className="nav-logo" to="/#home" aria-label="Showmate home">
            <ShellMark className="logo-mark" size={24} />
            <span>
              SHOW<span className="accent">MATE</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {site.nav.map((item) => (
              <Link
                key={item.id}
                className={`nav-link${currentSection === item.id ? ' is-active' : ''}`}
                to={`/${item.href}`}
                aria-current={currentSection === item.id ? 'true' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-search"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search records"
            >
              <Search size={16} aria-hidden="true" />
              <span>Search</span>
              <kbd>ctrl K</kbd>
            </button>

            <Link className="btn nav-cta" to="/#projects">
              Explore Projects
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="nav-burger"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={`menu${menuOpen ? ' is-open' : ''}`}
        hidden={!menuOpen}
      >
        <nav aria-label="Phone">
          <ul className="menu-list">
            {site.nav.map((item, index) => (
              <li key={item.id}>
                <Link
                  ref={index === 0 ? firstMenuLink : undefined}
                  className={`menu-link${currentSection === item.id ? ' is-active' : ''}`}
                  to={`/${item.href}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-foot">
          <button
            type="button"
            className="btn btn--dark btn--block"
            onClick={() => {
              setMenuOpen(false)
              setPaletteOpen(true)
            }}
          >
            <span>Search records</span>
            <Search size={18} aria-hidden="true" />
          </button>
          <Link className="btn btn--block" to="/#projects" onClick={() => setMenuOpen(false)}>
            Explore Projects
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="meta">Showmate — the Shellmates archive.</p>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
