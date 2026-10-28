import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import {
  countByGroup,
  groupMeta,
  groupOrder,
  projects,
  recordGroups,
  type ProjectGroup,
} from '../data/projects'
import { useReveal } from '../hooks/useReveal'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import ProjectVisual from './ProjectVisual'

type Filter = 'All' | ProjectGroup

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All')
  const rootRef = useReveal<HTMLElement>({ stagger: 0.04 })
  const boardRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  const visibleProjects = useMemo(
    () => (filter === 'All' ? projects : projects.filter((project) => project.group === filter)),
    [filter],
  )

  const leadProjects = visibleProjects.filter((project) => project.group === 'Projects')

  const visibleGroups = groupOrder.filter(
    (group) => group !== 'Projects' && (filter === 'All' || filter === group),
  )

  /* animate the board whenever the filter changes (the first paint is handled by the scroll reveal) */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const board = boardRef.current
    if (!board) return
    if (prefersReducedMotion()) return

    const items = board.querySelectorAll<HTMLElement>(
      '.pcard, .event-tile, .record-row, .archive-band-head',
    )
    if (!items.length) return

    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.025,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
    )
  }, [filter])

  return (
    <section className="section projects" id="projects" ref={rootRef} aria-labelledby="projects-title">
      <div className="projects-head">
        <h2 id="projects-title" data-reveal>
          The club, in 22 records.
        </h2>
        <p className="section-intro" data-reveal>
          Two internal projects and twenty events, technical tracks, practice formats and club
          programmes. Every record comes from the club’s own presentation.
        </p>
      </div>

      <div className="filters" role="group" aria-label="Filter records by type" data-reveal>
        {recordGroups.map((group) => (
          <button
            key={group}
            type="button"
            className="filter"
            aria-pressed={filter === group}
            onClick={() => setFilter(group)}
          >
            {group}
            <span className="filter-n">{group === 'All' ? projects.length : countByGroup(group)}</span>
          </button>
        ))}
        <span className="filter-count" aria-live="polite">
          {visibleProjects.length} of {projects.length} records
        </span>
      </div>

      <div className="archive" ref={boardRef}>
        {leadProjects.length > 0 && (
          <div className="projects-grid">
            {leadProjects.map((project, index) => {
              const featured = leadProjects.length > 1 && index === 0
              return (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className={`pcard${featured ? ' is-featured' : ''}`}
                  data-reveal
                >
                  <div className="pcard-media">
                    <ProjectVisual visual={project.visual} />
                  </div>

                  <div className="pcard-body">
                    <h3>{project.name}</h3>
                    <p className="pcard-desc">{project.summary}</p>

                    <p className="pcard-meta">
                      <span>
                        {project.category} · {project.audience}
                      </span>
                      <span
                        className="pcard-status"
                        data-state={project.format.toLowerCase().replace(/\s+/g, '-')}
                      >
                        {project.format}
                      </span>
                    </p>

                    <div className="pcard-foot">
                      <ul className="tags" aria-label={`${project.name} topics`}>
                        {project.topics.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                      <span className="pcard-link">
                        View record
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {filter === 'All' && (
          <figure className="archive-statement" data-reveal>
            <img
              src="/assets/dec-vt100-terminal.jpg"
              width={1920}
              height={1704}
              alt="A vintage DEC VT100 terminal on a desk, its screen switched off."
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <code>/* Where there is a shell, there is a way */</code>
              <span>22 records · Shellmates, ESI Algiers</span>
            </figcaption>
          </figure>
        )}

        {visibleGroups.map((group) => {
          const records = visibleProjects.filter((project) => project.group === group)
          if (!records.length) return null

          return (
            <section className="archive-band" key={group} aria-labelledby={`group-${group}`}>
              <div className="archive-band-head" data-reveal>
                <div>
                  <h3 id={`group-${group}`}>{groupMeta[group].title}</h3>
                  <p>{groupMeta[group].note}</p>
                </div>
                <span className="archive-band-count">
                  {records.length} {records.length === 1 ? 'record' : 'records'}
                </span>
              </div>

              {group === 'Events' ? (
                <div className="event-grid">
                  {records.map((record) => (
                    <Link
                      key={record.slug}
                      to={`/projects/${record.slug}`}
                      className="event-tile"
                      data-reveal
                    >
                      <h4>{record.name}</h4>
                      <p>{record.summary}</p>
                      <span className="event-tile-foot">
                        <span>
                          {record.format} · {record.audience}
                        </span>
                        <span className="event-tile-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <ul className="record-list">
                  {records.map((record) => (
                    <li key={record.slug}>
                      <Link className="record-row" to={`/projects/${record.slug}`} data-reveal>
                        <span className="record-name">{record.name}</span>
                        <span className="record-summary">{record.summary}</span>
                        <span className="record-meta">
                          {record.format} · {record.audience}
                        </span>
                        <ArrowUpRight className="record-arrow" size={16} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}

        {!visibleProjects.length && (
          <div className="projects-empty">
            <h3>No record in this view.</h3>
            <p>The archive has 22 records; this filter returned none. Try another type.</p>
            <button type="button" className="btn" onClick={() => setFilter('All')}>
              Show every record
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
