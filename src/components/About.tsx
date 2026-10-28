import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'

import { values, type Value } from '../data/values'
import { useReveal } from '../hooks/useReveal'
import Terminal from './Terminal'

export default function About() {
  const [active, setActive] = useState<Value>(values[0])
  const rootRef = useReveal<HTMLElement>()

  return (
    <section className="section section--tone" id="about" ref={rootRef} aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title" data-reveal>
          Who Are We?
        </h2>
        <p className="section-intro" data-reveal>
          A student club at the National Higher School of Computer Science in Algiers, specialising
          in cybersecurity since 2011.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p className="about-intro" data-reveal>
            Shellmates was founded in 2011 under the name OWASP. The club aims to promote
            cybersecurity awareness and culture in Algeria by organising events throughout the year
            — from introductory sessions to advanced, hands-on work.
          </p>

          <ul className="values" data-reveal aria-label="Shellmates objectives">
            {values.map((value) => (
              <li key={value.id}>
                <button
                  type="button"
                  className="value-btn"
                  aria-pressed={active.id === value.id}
                  aria-controls="value-detail"
                  onClick={() => setActive(value)}
                >
                  {value.title}
                  <Plus size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="value-detail" id="value-detail" data-reveal>
            <strong>{active.title}</strong>
            {active.detail}
          </div>

          <a className="hero-secondary about-cta" href="#structure" data-reveal>
            See how the club is organised
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="about-shell" data-reveal>
          <Terminal selectedValue={active} />
          <p className="about-shell-note">
            Pick an objective on the left, or type a command here. ↑ ↓ browse history.
          </p>
        </div>
      </div>
    </section>
  )
}
