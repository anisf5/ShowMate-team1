export interface Stat {
  value: number
  suffix?: string
  label: string
  /** A short explanation printed under the label. */
  note: string
  /** Years and other identifiers are printed as-is instead of counting up. */
  literal?: boolean
}

/**
 * Figures taken from pages 6, 7, 12 and 15 of the Shellmates club deck.
 * The presentation also includes an unlabelled monthly-views chart; no
 * numbers from that chart are restated here.
 */
export const stats: Stat[] = [
  {
    value: 2011,
    label: 'Founded as OWASP',
    note: 'Founded in 2011 under the name OWASP.',
    literal: true,
  },
  {
    value: 8,
    label: 'Departments',
    note: 'HR, Design, Relex, Technical, Events, Communication, Development, Multimedia.',
  },
  {
    value: 3,
    label: 'Flagship events',
    note: 'Hack.INI, CyberSec Bootcamp and BSides Algiers.',
  },
  {
    value: 5,
    label: 'CTF categories',
    note: 'Web exploitation, reverse engineering, pwn, digital forensics, cryptography.',
  },
]
