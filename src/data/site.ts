export const site = {
  name: 'Showmate',
  club: 'Shellmates',
  tagline: 'Where there is a shell, there is a way.',
  description:
    'The public archive of Shellmates — a student cybersecurity club at the National Higher School of Computer Science in Algiers (ESI), founded in 2011 under the name OWASP.',
  nav: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'stats', label: 'Figures', href: '#stats' },
    { id: 'structure', label: 'Structure', href: '#structure' },
  ],
  /**
   * Official channels, supplied with the club brief.
   */
  channels: [
    { label: 'Instagram', handle: '@shellmates', href: 'https://www.instagram.com/shellmates/' },
    { label: 'LinkedIn', handle: 'Shellmates Club', href: 'https://www.linkedin.com/company/shellmates-club/' },
    { label: 'GitHub', handle: 'anisf5/ShowMate-team1', href: 'https://github.com/anisf5/ShowMate-team1' },
  ],
  contactNote: 'Official Shellmates channels: Instagram, LinkedIn and GitHub.',
}

export const sectionIds = site.nav.map((item) => item.id)
