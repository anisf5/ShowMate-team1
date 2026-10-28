export interface Department {
  slug: string
  /** The short name used as the large word on the colour tile. */
  name: string
  focus: string
  /** Condensed from the department descriptions on pages 6 and 7 of the deck. */
  description: string
}

export const departments: Department[] = [
  {
    slug: 'hr',
    name: 'HR',
    focus: 'Members & internal organisation',
    description:
      'Handles recruitment, member integration, team coordination and follow-up, and keeps the club environment healthy and motivating.',
  },
  {
    slug: 'design',
    name: 'Design',
    focus: 'Visual identity & graphic content',
    description:
      'Creates the club’s visual identity: posters, social media designs, branding, event visuals and presentations.',
  },
  {
    slug: 'relex',
    name: 'Relex',
    focus: 'Partnerships & external relations',
    description:
      'Works on partnerships, sponsorships, networking and communication with companies, organisations, other clubs and professionals.',
  },
  {
    slug: 'technical',
    name: 'Technical',
    focus: 'Cybersecurity activities & infrastructure',
    description:
      'Leads technical and cybersecurity activities, manages the club’s infrastructure and organises workshops, training sessions and meetups.',
  },
  {
    slug: 'events',
    name: 'Events',
    focus: 'Event planning & logistics',
    description:
      'Plans and organises events from concept to execution — logistics, scheduling, coordination and on-site organisation.',
  },
  {
    slug: 'communication',
    name: 'Communication',
    focus: 'Audience & public presence',
    description:
      'Creates communication strategies, manages social media and announcements, and promotes the club’s activities.',
  },
  {
    slug: 'development',
    name: 'Development',
    focus: 'Websites, tools & platforms',
    description:
      'Builds and maintains the club’s websites, internal tools, applications and other digital projects.',
  },
  {
    slug: 'multimedia',
    name: 'Multimedia',
    focus: 'Photo, video & audiovisual',
    description:
      'Covers events and produces the club’s photo, video and audiovisual content, including promotional videos and edits.',
  },
]
