import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import Footer from '../components/Footer'
import ProjectVisual from '../components/ProjectVisual'
import { photoById } from '../data/photos'
import { projectBySlug, projects } from '../data/projects'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = slug ? projectBySlug(slug) : undefined
  const rootRef = useReveal<HTMLElement>({ start: 'top 95%', y: 18 })
  const bodyRef = useReveal<HTMLDivElement>({ start: 'top 80%', y: 22 })
  const refsRef = useReveal<HTMLElement>({ start: 'top 82%', y: 22 })
  const nextRef = useReveal<HTMLAnchorElement>({ start: 'top 92%', y: 14 })

  useEffect(() => {
    if (!project) return
    const previous = document.title
    document.title = `${project.name} — Showmate`
    return () => {
      document.title = previous
    }
  }, [project])

  if (!project) return <NotFound />

  const index = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(index + 1) % projects.length]
  const gallery = project.photos.map(photoById)
  const [photo, ...refs] = gallery
  const longTitle = project.name.length > 20

  return (
    <>
      <main id="main" className="detail" ref={rootRef}>
        <div className="detail-head">
          <Link className="detail-back" to="/#projects" data-reveal>
            <ArrowLeft size={14} aria-hidden="true" />
            All records
          </Link>

          <h1
            className={`detail-title${longTitle ? ' detail-title--long' : ''}`}
            data-reveal
          >
            {project.name}
          </h1>

          <div className="detail-meta" data-reveal>
            <span>{project.category}</span>
            <span>{project.format}</span>
            <b>{project.audience}</b>
          </div>

          <p className="detail-lede" data-reveal>
            {project.tagline}
          </p>
        </div>

        <div className="detail-visual">
          <div className="viz-wrap" data-reveal>
            <ProjectVisual visual={project.visual} />
          </div>

          <figure className="detail-photo" data-reveal>
            <img
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: photo.position }}
            />
            <figcaption>
              Club photograph — {photo.caption}
            </figcaption>
          </figure>
        </div>

        <div className="detail-grid" ref={bodyRef}>
          <div className="detail-body" data-reveal>
            <h2>About this record</h2>
            {project.description.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <h2 className="detail-subhead">What it involves</h2>
            <ul className="detail-highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <aside className="detail-side">
            <section data-reveal>
              <h2>Topics</h2>
              <ul className="tags">
                {project.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </section>

            <section data-reveal>
              <h2>Who runs it</h2>
              <p>{project.team}</p>
            </section>

            <section data-reveal>
              <h2>Links</h2>
              <div className="detail-links">
                {project.links.length ? (
                  project.links.map((link) => (
                    <a key={link.href} href={link.href}>
                      {link.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ))
                ) : (
                  <p className="pending">
                    No public repository or demo link is available yet. This archive does not invent
                    URLs.
                  </p>
                )}
              </div>
            </section>

            <section data-reveal>
              <h2>Record type</h2>
              <p className="meta">
                {project.format} · {project.audience}
              </p>
            </section>
          </aside>
        </div>

        <section className="detail-refs" ref={refsRef} aria-label="Photographs">
          <div className="detail-refs-grid">
            {refs.map((item) => (
              <figure key={item.src} data-reveal>
                <img
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: item.position }}
                />
                <figcaption>
                  Club photograph — {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Link
          className="detail-next"
          to={`/projects/${next.slug}`}
          ref={nextRef}
          data-reveal
        >
          <div>
            <strong>{next.name}</strong>
            <span>Next record · {next.category}</span>
          </div>
          <ArrowRight size={28} aria-hidden="true" />
        </Link>
      </main>
      <Footer />
    </>
  )
}
