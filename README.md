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
- **Read a record** from a lead project card, a flagship event card or a ledger row, then follow *Next
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
- Club photographs supplied with the presentation, stored in `public/assets/club/`. See
  [Photography](#photography)

## Structure

```
public/
  assets/
    club/          club photographs supplied with the club
    Logo/          the Shellmates crest: mark, favicon icons
    credits.json   club photograph credits
media-source/       the original club PNGs (not shipped)
src/
  App.tsx               shell, router and the skip link
  pages/                Home, ProjectDetail, NotFound
  components/           Navbar, Hero, Projects, ProjectVisual, About, Terminal,
                        Stats, Structure, FinalCTA, Footer, CommandPalette,
                        ContactDialog, Cursor
  data/                 site, projects, photos, values, stats, departments
  hooks/                useReveal (GSAP + ScrollTrigger), useCounter
  lib/gsap.ts           GSAP registration and the reduced-motion check
  styles/               tokens, base, nav, sections, ui
```

The club crest is used from `public/assets/Logo/` (source `shellmate_logo.png`, optimized `shellmate-mark.png`,
`icon-64.png`, `icon-180.png`) and lives in the navbar, the footer lockup and the favicon; the original stays
in `media-source/Logo/`.

The record previews are **drawn in the page** (`src/components/ProjectVisual.tsx`): each fragment is
a small HTML/SVG interface study marked `data-ui` and hidden from assistive tech. Four layouts cover
the archive — a mentor path, an attack chain, an event brief and a checklist.

Photographs come from one place: the Shellmates archive itself, recorded in code. Club photographs
were taken at Shellmates events; the credits are recorded in `public/assets/club/credits.json`. Each
record names four of them in `projects.ts`, and the caption on screen reads *Club photograph*. Nothing
is presented as a screenshot of a Shellmates project.

## Club content

Everything the club supplied lives in `src/data/`:

| File             | Holds                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `site.ts`        | Club name, **slogan**, nav, contact copy, official channels (Instagram, LinkedIn, GitHub) |
| `projects.ts`    | All 22 records: group, category, format, audience, copy, topics, highlights, visual spec, links |
| `values.ts`      | The three objectives from the club deck                               |
| `stats.ts`       | The four figures in the ledger (2011, 8, 3, 5)                        |
| `departments.ts` | The eight departments and their responsibilities                      |

The archive is grouped rather than flattened, because the 22 entries are not all software projects:

| Group      | Records |
| ---------- | ------- |
| Projects   | ShellPath; Cybersecurity-Attacks |
| Events     | Hack.INI; CyberSec Bootcamp; BSides Algiers |
| Skills     | Web Pentesting; Cryptography; Pwn / Binary Exploitation; Reverse Engineering; Digital Forensics; Active Directory; Malware Development; Blue Teaming; Cybersecurity Workshops |
| Practice   | Hack The Box Meetups; CTF Competitions; Team-Based Challenges |
| Club       | Internal Events; External Events; Internal Recreational Activities; Department-Specific Workshops; Cybersecurity Demonstrations |

What is deliberately absent:

- **Official channels** — supplied with the brief and read from `site.channels` in
  `src/data/site.ts`: Instagram (`@shellmates`), LinkedIn (Shellmates Club) and GitHub
  (`anisf5/ShowMate-team1`). The footer, the contact panel and the terminal's `contact` command use
  them; the email address stays pending.
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

One library, recorded in code:

- **Club crest** — `public/assets/Logo/`: the Shellmates emblem (source `shellmate_logo.png` in
  `media-source/Logo/`, optimized derivatives `shellmate-mark.png`, `icon-64.png`, `icon-180.png`) used
  in the navbar, the footer lockup and the favicon.

- **Club photographs** — `public/assets/club/` (13 files), taken at Shellmates events and supplied
  with the club material. `public/assets/club/credits.json` lists them and notes that the club should
  confirm consent for the people shown before reusing them outside this archive. No stock or
  third-party hardware photographs are used: the archive shows only the club's own events.

| Photograph | Event |
| ---- | ------- |
| `bsides-stage.jpg` | BSides Algiers, stage and partners |
| `bsides-audience.jpg` | BSides Algiers, the audience |
| `bsides-hall.jpg` | BSides Algiers, the hall |
| `group-outside.jpg` | Members, group photograph |
| `refreshments.jpg` | Refreshments at an internal event |
| `speakers.jpg` | Guests with their badges |
| `lecture-hall.jpg` | A session in the lecture hall |
| `check-in.jpg` | Check-in and lanyards |
| `pair-laptop.jpg` | A working session, side by side |
| `ctf-winners.jpg` | CTF winners on stage |
| `student-laptop.jpg` | Working a challenge |
| `lan-night.jpg` | The room during a club event |
| `opening-talk.jpg` | Opening talk |

The club PNGs were resized to at most 1400 px on the long edge and saved as JPEG (quality 82); the
originals live in `media-source/` and are not shipped. The site renders every photograph in
grayscale and restores colour on hover, so the palette stays quiet until you look closer. None of the
photographs is a screenshot of a Shellmates project.

## Design notes

The direction is a dense board of unequal tiles ("the well-kept board"): a two-by-two hero, two lead
project cards in a 7/5 band, a full-width slogan photograph, three flagship events as photo cards on a
staircase, and the remaining seventeen records as a grouped ledger of rows. The events run in the
order a member meets them — Hack.INI (initiation), CyberSec Bootcamp (fundamentals), BSides Algiers
(conference) — so the offset itself carries the sequence and no numerals are needed. Below 900 px the
staircase becomes three horizontal photo-and-text rows, then three stacked cards.

The archive opens as a Unix session — terminal, paths, a `Ctrl+K` palette — and the slogan appears as
the code comment it is.

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
supplied, the ledger rows are the archive's table rather than a card grid, and the ten font sizes are
one display scale plus two mono label sizes doing different jobs.
