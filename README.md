# Showmate

The public archive of **Shellmates**, the student cybersecurity club at the National Higher School
of Computer Science in Algiers (ESI). The page behaves like a Unix session: a terminal prints the
records, objectives, figures and departments, and every record opens on its own page.

> Where there is a shell, there is a way.

The archive holds the **22 records** supplied from the club's presentation, grouped into
**Projects** (2), **Events** (3), **Skills** (9), **Practice** (3) and **Club** (5). The presentation
publishes no dates, repository links, participant names or named members, so the site leaves those
out instead of inventing them.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the built site on http://localhost:4173
npm run typecheck  # tsc --noEmit
```

## Routes and things to try

| Route             | What it is                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | The archive: hero, 22 records, about, figures, structure, CTA           |
| `/projects/:slug` | One record page (`shellpath`, `hack-ini`, `active-directory`, …)         |
| anything else     | The not-found page                                                      |

- **Filter the board** by group: `All` (22), `Projects` (2), `Events` (3), `Skills` (9),
  `Practice` (3), `Club` (5). The count updates with the view.
- **Read a record** from a lead project card, an event tile or a ledger row, then follow *Next
  record* through the archive.
- **Use the terminal** in the About section: `help`, `ls`, `cat <record>`, `find <term>`,
  `slogan`, `objective <name>`, `objectives`, `departments`, `stats`, `whoami`, `contact`,
  `clear` (and `sudo`, for the curious). `cat` accepts a slug or a record name.
- **Press `Ctrl`/`Cmd` + `K`** anywhere to open the record palette, or use the Search button. It
  searches names, groups, formats, summaries and topics; arrows and Enter work.

## Stack

- React 19 + TypeScript, built with Vite 8
- React Router 7 (`BrowserRouter`)
- GSAP 3 + ScrollTrigger for reveals, the filter transition, the mobile menu and the hero sequence
- Lucide React for icons
- Vanilla CSS, five files: `tokens`, `base`, `nav`, `sections`, `ui` (no CSS framework)
- Self-hosted **Archivo Variable** (headings/body) and **JetBrains Mono Variable** (technical labels,
  terminal and code) through Fontsource — no font CDN
- Photographs from Wikimedia Commons, stored in `public/assets/` — see [Photography](#photography)

## Structure

```
public/assets/          six photographs + credits.json (licences and credits)
src/
  App.tsx               shell, router and the skip link
  pages/                Home, ProjectDetail, NotFound
  components/           Navbar, Hero, Projects, ProjectVisual, About, Terminal,
                        Stats, Structure, FinalCTA, Footer, CommandPalette,
                        ContactDialog, ShellMark, Cursor
  data/                 site, projects, values, stats, departments
  hooks/                useReveal (GSAP + ScrollTrigger), useCounter
  lib/gsap.ts           GSAP registration and the reduced-motion check
  styles/               tokens, base, nav, sections, ui
```

The record previews are **drawn in the page** (`src/components/ProjectVisual.tsx`): each fragment is
a small HTML/SVG interface study marked `data-ui` and hidden from assistive tech. Four layouts cover
the archive — a mentor path, an attack chain, an event brief and a checklist.

The photographs are reference imagery of the subject's world (racks, cabling, circuit boards, a
VT100 terminal), not pictures of Shellmates' own work. The captions say so and the footer credits
every file. Each record page shows a different lead photograph and three references, rotating
through the six files.

## Club content

Everything the club supplied lives in `src/data/`:

| File             | Holds                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `site.ts`        | Club name, **slogan**, nav, contact copy, official channels (empty)    |
| `projects.ts`    | All 22 records: group, category, format, audience, copy, topics, highlights, visual spec, links |
| `values.ts`      | The three objectives from the club deck                               |
| `stats.ts`       | The four figures in the ledger (2011, 8, 3, 5)                        |
| `departments.ts` | The eight departments and their responsibilities                      |

The archive is grouped rather than flattened, because the 22 entries are not all software projects:

| Group      | Records |
| ---------- | ------- |
| Projects   | ShellPath; Cybersecurity-Attacks |
| Events     | Hack.INI; BSides Algiers; CyberSec Bootcamp |
| Skills     | Web Pentesting; Cryptography; Pwn / Binary Exploitation; Reverse Engineering; Digital Forensics; Active Directory; Malware Development; Blue Teaming; Cybersecurity Workshops |
| Practice   | Hack The Box Meetups; CTF Competitions; Team-Based Challenges |
| Club       | Internal Events; External Events; Internal Recreational Activities; Department-Specific Workshops; Cybersecurity Demonstrations |

What is deliberately absent:

- **Official channels** — add verified URLs to `site.channels`; the footer, the contact panel and
  the terminal's `contact` command read from that array.
- **Record links** — the `links` array is empty for every record. While it is empty, the detail page
  prints a "no public link yet" note instead of inventing a URL.
- **Dates** — the deck publishes no calendar, so records carry a factual format and audience, not a
  date.
- **People** — the deck describes departments and mentor teams, not named individuals, so the site
  does not print names or handles.

## Motion and accessibility

- Every section reveals with GSAP (`useReveal`); the hero runs a short load sequence, the counters
  animate in view, and the record photographs drift slowly in their frames.
- `prefers-reduced-motion` is honoured in `src/lib/gsap.ts` (timelines are skipped, content is never
  hidden by CSS) and in the stylesheet (animations collapse to a single frame).
- The terminal is a real form: type and press Enter, or use the suggestion chips. Commands are
  described in `Terminal.tsx`; output is printed as text, never injected as HTML.
- The palette is a native `<dialog>`, closes with `Esc`, and supports arrow keys and Enter.
- Skip link, visible focus rings, labelled landmarks, and a colour palette chosen for contrast on
  the near-black ground.

## Photography

Six files in `public/assets/`, all from Wikimedia Commons. `public/assets/credits.json` records the
title, creator, licence and source page for each one; the footer prints the same credits.

| File | Creator | Licence |
| ---- | ------- | ------- |
| `servers-in-a-rack.jpg` | Abigor | CC BY-SA 3.0 |
| `efta00002522-cluttered-server-rack-filled-with-colorful.jpg` | Federal Bureau of Investigation | Public domain |
| `macro-circuit-board.jpg` | Ingo Dierking | CC BY-SA 4.0 |
| `dec-vt100-terminal.jpg` | Jason Scott | CC BY 2.0 |
| `network-switches.jpg` | ShakataGaNai | CC BY-SA 3.0 |
| `green-circuit-board-ii-2389301870.jpg` | Peter Shanks | CC BY 2.0 |

The files are unmodified; the site applies a CSS grayscale/contrast filter at render time. The
share-alike images are credited in the footer and in `credits.json`; keep both if you reuse them.
None of the photographs shows a Shellmates project or event.

## Design notes

The direction is a dense board of unequal tiles ("the well-kept board"): a two-by-two hero, two lead
project cards in a 7/5 band, a full-width slogan photograph, three event tiles in a 5/4/3 band, and
the remaining seventeen records as a grouped ledger of rows. The archive opens as a Unix session —
terminal, paths, a `Ctrl+K` palette — and the slogan appears as the code comment it is.

Type is one sans (Archivo Variable) plus one mono (JetBrains Mono) for anything that is literally a
command, a path, a label or a figure. The neon green is reserved for state and action, never for
body copy.

## Checks

```bash
npm run typecheck
npm run build
```

The design gate used while building this page (taste-skill) is not a project dependency; when it is
installed it can be run against the preview server:

```bash
node "<path-to>/design-taste-frontend/scripts/inspect.mjs" http://localhost:4173 --allow mono
```

The home page and the detail pages pass that gate with **0 FAIL**. Its remaining warnings are
defended in the design notes: recorded video was not used because no honest Shellmates footage was
supplied, and the ledger rows are the archive's table, not a card grid.
