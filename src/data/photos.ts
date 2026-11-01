export type PhotoKind = 'club'

export interface Photo {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
  kind: PhotoKind
  credit: string
  /** Focal point for crops, when centring the frame would lose the subject. */
  position?: string
}

/**
 * Every photograph in the archive is a club photograph: taken at Shellmates events and
 * supplied with the club material, stored in `public/assets/club/`.
 *
 * Neither kind is a screenshot of a Shellmates project.
 */
export const photos: Photo[] = [
  {
    id: 'bsides-stage',
    src: '/assets/club/bsides-stage.jpg',
    width: 1080,
    height: 720,
    alt: 'A group of guests standing on stage in front of a BSides Algiers backdrop covered in sponsor logos.',
    caption: 'BSides Algiers, stage and partners',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'bsides-audience',
    src: '/assets/club/bsides-audience.jpg',
    width: 1080,
    height: 720,
    alt: 'A full lecture hall of attendees facing the stage at BSides Algiers.',
    caption: 'BSides Algiers, the audience',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'bsides-hall',
    src: '/assets/club/bsides-hall.jpg',
    width: 1080,
    height: 720,
    alt: 'Rows of attendees filling a large conference hall during a talk.',
    caption: 'BSides Algiers, the hall',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'group-outside',
    src: '/assets/club/group-outside.jpg',
    width: 809,
    height: 507,
    alt: 'A large group of students posing outdoors beside a green Shellmates banner.',
    caption: 'Members, group photograph',
    kind: 'club',
    credit: 'Shellmates archive',
    position: '74% 50%',
  },
  {
    id: 'refreshments',
    src: '/assets/club/refreshments.jpg',
    width: 1069,
    height: 1080,
    alt: 'Juice bottles and boxes of snacks arranged on a table at a club event.',
    caption: 'Refreshments at an internal event',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'speakers',
    src: '/assets/club/speakers.jpg',
    width: 996,
    height: 1106,
    alt: 'Three guests wearing event lanyards, posing together in a lecture hall.',
    caption: 'Guests with their badges',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'lecture-hall',
    src: '/assets/club/lecture-hall.jpg',
    width: 1046,
    height: 1057,
    alt: 'Students seated across a tiered lecture hall during a session.',
    caption: 'A session in the lecture hall',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'check-in',
    src: '/assets/club/check-in.jpg',
    width: 1079,
    height: 1350,
    alt: 'A member handing a lanyard and badge to an attendee at a registration desk.',
    caption: 'Check-in and lanyards',
    kind: 'club',
    credit: 'Shellmates archive',
    position: '50% 74%',
  },
  {
    id: 'pair-laptop',
    src: '/assets/club/pair-laptop.jpg',
    width: 921,
    height: 1206,
    alt: 'Two students leaning over a laptop together during a club session.',
    caption: 'A working session, side by side',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'ctf-winners',
    src: '/assets/club/ctf-winners.jpg',
    width: 1080,
    height: 1200,
    alt: 'Five students holding certificates on stage in front of a slide reading CTF PWN winners.',
    caption: 'CTF winners on stage',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'student-laptop',
    src: '/assets/club/student-laptop.jpg',
    width: 1000,
    height: 1120,
    alt: 'A student thinking in front of an open laptop during a club session.',
    caption: 'Working a challenge',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'lan-night',
    src: '/assets/club/lan-night.jpg',
    width: 1033,
    height: 1033,
    alt: 'A darkened room lit in purple, with students working at laptops and cables across the tables.',
    caption: 'The room during a club event',
    kind: 'club',
    credit: 'Shellmates archive',
  },
  {
    id: 'opening-talk',
    src: '/assets/club/opening-talk.jpg',
    width: 938,
    height: 1106,
    alt: 'A speaker at a wooden podium beneath a projection reading “Word from our leader”.',
    caption: 'Opening talk',
    kind: 'club',
    credit: 'Shellmates archive',
  },
]

const byId = new Map(photos.map((photo) => [photo.id, photo]))

export function photoById(id: string): Photo {
  const photo = byId.get(id)
  if (!photo) throw new Error(`Unknown photograph: ${id}`)
  return photo
}
