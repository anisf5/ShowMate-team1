import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main id="main" className="notfound">
      <p className="meta">404 — no such path</p>
      <h1>This page left the archive.</h1>
      <p>
        The address you followed is not part of Showmate. The projects that do exist are one click
        away.
      </p>
      <Link className="btn" to="/#projects">
        Back to the projects
      </Link>
    </main>
  )
}
