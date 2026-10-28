export interface Value {
  id: string
  title: string
  /** One line printed by the terminal when the objective is selected. */
  line: string
  detail: string
}

/**
 * The three objectives printed on page 4 of the club deck. The titles are
 * short labels; the detail keeps the original wording.
 */
export const values: Value[] = [
  {
    id: 'knowledge',
    title: 'Share & Compete',
    line: 'a space for knowledge sharing and constructive competition.',
    detail:
      'Objective 01 — create a space for knowledge sharing and constructive competition.',
  },
  {
    id: 'fundamentals',
    title: 'Start at the Fundamentals',
    line: 'an introduction to the fundamentals of cybersecurity.',
    detail:
      'Objective 02 — introduce those interested to the fundamentals of cybersecurity.',
  },
  {
    id: 'recognition',
    title: 'Reach Further',
    line: 'recognition beyond Algeria.',
    detail: 'Objective 03 — aim to gain international recognition.',
  },
]
