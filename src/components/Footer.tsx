import { Link } from 'react-router-dom'

import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">
        <div className="footer-brand">
          <img
            className="footer-crest"
            src="/assets/Logo/shellmate-mark.png"
            alt=""
            width={79}
            height={104}
            loading="lazy"
            decoding="async"
          />
          <p className="footer-wordmark" aria-hidden="true">
            SHOW<span>MATE</span>
          </p>
        </div>
        <p className="footer-mark-meta">
          Where there is a shell, there is a way.
          <br />
          Shellmates · ESI Algiers · est. 2011
        </p>
      </div>

      <div className="footer-body">
        <p className="footer-desc">
          Showmate is the public archive of Shellmates — a student cybersecurity club at the
          National Higher School of Computer Science in Algiers, founded in 2011 as OWASP.
        </p>

        <nav className="footer-col" aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            {site.nav.slice(0, 3).map((item) => (
              <li key={item.id}>
                <Link to={`/${item.href}`}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/#connect">Contact</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Club">
          <h2>Club</h2>
          <ul>
            {site.nav.slice(3).map((item) => (
              <li key={item.id}>
                <Link to={`/${item.href}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <h2>Elsewhere</h2>
          <ul>
            <li>
              <span>GitHub — pending</span>
            </li>
            <li>
              <span>Social — pending</span>
            </li>
            <li>
              <span>Email — pending</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Showmate · Shellmates</span>
        <span className="footer-status">guest@showmate:~$ all systems nominal</span>
      </div>
    </footer>
  )
}
