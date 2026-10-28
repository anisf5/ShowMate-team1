import { departments } from '../data/departments'
import { useReveal } from '../hooks/useReveal'

export default function Structure() {
  const rootRef = useReveal<HTMLElement>()

  return (
    <section className="section section--tone" id="structure" ref={rootRef} aria-labelledby="structure-title">
      <div className="section-head">
        <h2 id="structure-title" data-reveal>
          One Club. Eight Departments.
        </h2>
        <p className="section-intro" data-reveal>
          Every department runs a part of the club, from recruitment and design to technical
          workshops, event logistics and the platforms the club runs on.
        </p>
      </div>

      <ul className="structure-grid">
        {departments.map((department) => (
          <li className="dept" key={department.slug} data-reveal>
            <div className="dept-face">
              <span className="dept-index">dept/{department.slug}</span>
              <p className="dept-name">{department.name}</p>
            </div>
            <div className="dept-meta">
              <p className="dept-focus">{department.focus}</p>
              <p className="dept-desc">{department.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
