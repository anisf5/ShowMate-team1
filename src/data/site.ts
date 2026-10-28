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
   * Official channels are intentionally empty: no verified Shellmates URLs
   * were supplied with the brief. Add real ones here and they will appear in
   * the footer, the contact panel and the terminal's `contact` command.
   */
  channels: [] as Array<{ label: string; handle: string; href: string }>,
  contactNote:
    'Official Shellmates channels have not been supplied yet. Add verified links in src/data/site.ts.',
}

export const sectionIds = site.nav.map((item) => item.id)
