import { Link } from 'react-router-dom'

import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">
        <p className="footer-wordmark" aria-hidden="true">
          SHOW<span>MATE</span>
        </p>
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

        <div className="footer-note">
          <p>
            Club facts and copy come from the Shellmates club presentation. Official channels stay
            unlinked until they are verified; add them in <code>src/data/</code>.
          </p>
        </div>
      </div>

      <div className="footer-credits">
        <p>
          Photographs: Abigor (CC BY-SA 3.0), Ingo Dierking (CC BY-SA 4.0), Jason Scott (CC BY 2.0),
          Peter Shanks (CC BY 2.0), ShakataGaNai (CC BY-SA 3.0) and the FBI (public domain), via
          Wikimedia Commons. They show the world around the club, not its own work.
        </p>
        <p>
          Assets and licences are recorded in <code>public/assets/credits.json</code>. Project
          previews are drawn in the page: they are interface studies, not screenshots.
        </p>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Showmate · Shellmates</span>
        <span className="footer-status">guest@showmate:~$ all systems nominal</span>
      </div>
    </footer>
  )
}
