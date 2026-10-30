import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import Footer from '../components/Footer'
import ProjectVisual from '../components/ProjectVisual'
import { projectBySlug, projects, type Project } from '../data/projects'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'

const photos = [
  {
    src: '/assets/dec-vt100-terminal.jpg',
    width: 1920,
    height: 1704,
    alt: 'A vintage DEC VT100 terminal on a desk, its screen switched off.',
    caption: 'DEC VT100 terminal — archive reference',
  },
  {
    src: '/assets/network-switches.jpg',
    width: 1920,
    height: 1277,
    alt: 'A rack of network switches, their ports and status lights in rows.',
    caption: 'Network switches — infrastructure reference',
  },
  {
    src: '/assets/macro-circuit-board.jpg',
    width: 1920,
    height: 1280,
    alt: 'A circuit board photographed close up, its green solder mask and gold traces in sharp focus.',
    caption: 'Circuit board, macro — material reference',
  },
  {
    src: '/assets/servers-in-a-rack.jpg',
    width: 1886,
    height: 2835,
    alt: 'Servers in a rack seen from the front, cables bundled at the side.',
    caption: 'Servers in a rack — hardware reference',
  },
  {
    src: '/assets/green-circuit-board-ii-2389301870.jpg',
    width: 1920,
    height: 1440,
    alt: 'Close-up of glowing green circuit-board traces on a dark board.',
    caption: 'Circuit traces — material reference',
  },
  {
    src: '/assets/efta00002522-cluttered-server-rack-filled-with-colorful.jpg',
    width: 1152,
    height: 768,
    alt: 'A server rack densely patched with orange, blue and yellow network cables.',
    caption: 'Server rack, cabled — infrastructure reference',
  },
]

export default function ProjectDetail() {
  const { slug } = useParams()
  const [allProjects, setAllProjects] = useState<Project[]>(projects)
  const [remoteProject, setRemoteProject] = useState<Project | undefined>(undefined)
  const [remoteChecked, setRemoteChecked] = useState(false)
  useEffect(() => {
    let active = true
    setRemoteChecked(false)
    setRemoteProject(undefined)
    const endpoints = [{ path: '/projects', group: 'Projects' }, { path: '/events', group: 'Events' }, { path: '/skills', group: 'Skills' }, { path: '/practice', group: 'Practice' }, { path: '/club', group: 'Club' }]
    const normalize = (item: any, group: string): Project => ({ ...item, group, category: item.category || group, format: item.format || item.level || item.difficulty || '', audience: item.audience || 'Open to all', description: Array.isArray(item.description) ? item.description : item.description ? [item.description] : [], topics: item.topics || [], highlights: item.highlights || item.outcomes || item.activities || item.rules || [], team: item.team || item.organizer || item.instructor || item.contact || '', visual: item.visual && ['path', 'attack', 'brief', 'checklist'].includes(item.visual.id) ? { id: item.visual.id, file: item.visual.file || item.name || '', status: item.visual.status || item.status || 'published', command: item.visual.command || '', rows: Array.isArray(item.visual.rows) ? item.visual.rows : [], foot: item.visual.foot || item.location || item.duration || '' } : { id: group === 'Projects' ? 'path' : 'brief', file: item.name || '', status: item.status || 'published', command: '', rows: (item.topics || item.highlights || []).map((label: string) => ({ label, note: '' })), foot: item.location || item.duration || '' }, links: item.links || item.resources || [] })
    Promise.all(endpoints.map(async ({ path, group }) => { const response = await fetch(`${API}${path}`); if (!response.ok) return []; const data = await response.json(); return (data.items || []).map((item: any) => normalize(item, group)) }))
      .then((collections) => { if (!active) return; const all = collections.flat() as Project[]; if (all.length) setAllProjects(all); setRemoteProject(all.find(item => item.slug === slug)) })
      .catch(() => { if (active) setRemoteProject(undefined) })
      .finally(() => { if (active) setRemoteChecked(true) })
    return () => { active = false }
  }, [slug])
  const project = remoteProject || (remoteChecked && slug ? projectBySlug(slug) : undefined)
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

  if (!project) return remoteChecked ? <NotFound /> : <main className="detail"><p className="meta">Loading record…</p></main>

  // A MongoDB item may not exist in the bundled seed array (especially Events/Skills).
  // Use the loaded archive and always provide a safe photo index.
  const archive = allProjects.length ? allProjects : projects
  const foundIndex = archive.findIndex((item) => item.slug === project.slug)
  const index = foundIndex >= 0 ? foundIndex : 0
  const next = archive[(index + 1) % archive.length] || projects[0]
  const photo = photos[(index < 0 ? 0 : index) % photos.length] || photos[0]
  const refs = [1, 2, 3].map((offset) => photos[(index + offset) % photos.length] || photos[0])
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
            />
            <figcaption>Reference photograph — {photo.caption}</figcaption>
          </figure>
        </div>

        <div className="detail-grid" ref={bodyRef}>
          <div className="detail-body" data-reveal>
            <h2>About this record</h2>
            {(project.description || []).map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <h2 className="detail-subhead">What it involves</h2>
            <ul className="detail-highlights">
              {(project.highlights || []).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <aside className="detail-side">
            <section data-reveal>
              <h2>Topics</h2>
              <ul className="tags">
                {(project.topics || []).map((topic) => (
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
                {(project.links || []).length ? (
                  (project.links || []).map((link) => (
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

        <section className="detail-refs" ref={refsRef} aria-label="Reference photographs">
          <div className="detail-refs-grid">
            {refs.map((item) => (
              <figure key={item.src} data-reveal>
                <img
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  loading="lazy"
                />
                <figcaption>{item.caption}</figcaption>
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
