import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { useReveal } from '../hooks/useReveal'
import ContactDialog from './ContactDialog'

export default function FinalCTA() {
  const [contactOpen, setContactOpen] = useState(false)
  const rootRef = useReveal<HTMLElement>()

  return (
    <section className="section" id="connect" ref={rootRef} aria-labelledby="cta-title">
      <div className="cta-band">
        <div className="cta-main" data-reveal>
          <header>
            <h2 id="cta-title">Come Build the Next Record.</h2>
            <p>
              Shellmates is a community built around learning, experimentation, competition and
              collaboration. Whether you want to deepen your technical skills or meet people who
              share the same passion, there is a place for you.
            </p>
          </header>

          <div className="cta-foot">
            <div className="cta-actions">
              <a className="btn" href="#projects">
                Explore Projects
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <button type="button" className="cta-link" onClick={() => setContactOpen(true)}>
                Connect With Shellmates
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="cta-meta">Where there is a shell, there is a way.</p>
          </div>
        </div>

        <div className="cta-photo" data-reveal>
          <img
            src="/assets/club/bsides-hall.jpg"
            width={1080}
            height={720}
            alt="Rows of attendees filling a large conference hall during a talk."
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  )
}
