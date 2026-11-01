import { stats } from '../data/stats'
import { useCounter } from '../hooks/useCounter'
import { useReveal } from '../hooks/useReveal'

function Counter({
  value,
  suffix = '',
  literal = false,
}: {
  value: number
  suffix?: string
  literal?: boolean
}) {
  const ref = useCounter(value, suffix, !literal)
  return (
    <span className="stat-value" ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const rootRef = useReveal<HTMLElement>()

  return (
    <section className="section" id="stats" ref={rootRef} aria-labelledby="stats-title">
      <div className="section-head">
        <h2 id="stats-title" data-reveal>
          The Club in Figures.
        </h2>
        <p className="section-intro" data-reveal>
          Four facts taken from the club’s own presentation. They describe the club’s structure and
          programme, not a growth metric.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stats-aside" data-reveal>
          <p>
            Shellmates began in 2011 as OWASP. Eight departments run the club, three flagship events
            are presented in the deck, and the CTF programme covers five main categories.
          </p>
          <div className="stats-photo">
            <img
              src="/assets/club/lecture-hall.jpg"
              width={1046}
              height={1057}
              alt="Students seated across a tiered lecture hall during a session."
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="stats-list">
          {stats.map((stat) => (
            <div className="stat" key={stat.label} data-reveal>
              <div className="stat-copy">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-note">{stat.note}</span>
              </div>
              <Counter value={stat.value} suffix={stat.suffix} literal={stat.literal} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
