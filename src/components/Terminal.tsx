import { useCallback, useEffect, useRef, useState } from 'react'

import { departments } from '../data/departments'
import { groupOrder, projects } from '../data/projects'
import { site } from '../data/site'
import { stats } from '../data/stats'
import { values, type Value } from '../data/values'

type LineKind = 'in' | 'out' | 'accent' | 'muted'

type Line = {
  id: number
  kind: LineKind
  text: string
}

type Props = {
  selectedValue: Value | null
}

const greeting: Line[] = [
  { id: 0, kind: 'muted', text: 'showmate 1.0 — shellmates archive' },
  { id: 1, kind: 'out', text: "type 'help' to see what this shell can do." },
  { id: 2, kind: 'accent', text: '/* Where there is a shell, there is a way */' },
]

const help = [
  'help               this list',
  'ls                 list the 22 records by group',
  'cat <record>       read one record (slug or name)',
  'find <term>        search names, groups, formats and topics',
  'slogan             the club’s line',
  'objective <name>   read one club objective',
  'objectives         list the three objectives',
  'departments        list the eight club departments',
  'stats              the club figures, with their source',
  'whoami             who this shell thinks you are',
  'contact            how to reach Shellmates',
  'clear              clear the screen',
]

const quickChips = ['help', 'ls', 'cat shellpath', 'find web', 'slogan']

export default function Terminal({ selectedValue }: Props) {
  const [lines, setLines] = useState<Line[]>(greeting)
  const [input, setInput] = useState('')

  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(3)
  const history = useRef<string[]>([])
  const historyIndex = useRef(0)
  const lastValue = useRef<string | null>(null)

  const nextId = () => idRef.current++

  const push = (kind: LineKind, text: string) => {
    setLines((previous) => [...previous, { id: nextId(), kind, text }].slice(-90))
  }

  const run = useCallback((raw: string) => {
    const command = raw.trim()
    if (!command) return

    setLines((previous) => [...previous, { id: nextId(), kind: 'in' as const, text: command }].slice(-90))

    const [name, ...rest] = command.split(/\s+/)
    const argument = rest.join(' ')
    const key = name.toLowerCase()

    if (key === 'clear') {
      setLines([])
      return
    }

    if (key === 'help') {
      help.forEach((line) => push('out', line))
      return
    }

    if (key === 'ls') {
      groupOrder.forEach((group) => {
        const items = projects.filter((project) => project.group === group)
        push('out', `${group.toLowerCase().padEnd(9)} ${items.map((project) => project.slug).join('  ')}`)
      })
      push('muted', `${projects.length} records in the archive`)
      return
    }

    if (key === 'cat') {
      const needle = argument.toLowerCase()
      const project = projects.find(
        (item) => item.slug === needle || item.name.toLowerCase() === needle,
      )
      if (!project) {
        push('out', `no such record: ${argument || '—'}. try 'ls'.`)
        return
      }
      push('accent', `${project.name} — ${project.tagline}`)
      push('out', `${project.category} · ${project.format} · ${project.audience}`)
      push('muted', project.topics.join(' / '))
      push('out', `open /projects/${project.slug} for the full record.`)
      return
    }

    if (key === 'find') {
      if (!argument) {
        push('out', 'usage: find <term>')
        return
      }
      const needle = argument.toLowerCase()
      const matches = projects.filter((project) =>
        [
          project.name,
          project.group,
          project.category,
          project.format,
          project.summary,
          project.tagline,
          project.topics.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle),
      )
      if (!matches.length) {
        push('out', `nothing matches '${argument}'.`)
        return
      }
      matches.forEach((project) => push('out', `${project.slug.padEnd(36)} ${project.name}`))
      return
    }

    if (key === 'slogan') {
      push('accent', `/* ${site.tagline} */`)
      return
    }

    if (key === 'objective' || key === 'value') {
      const needle = argument.toLowerCase().replace(/\s+/g, '-')
      const value = values.find(
        (item) => item.id === needle || item.title.toLowerCase().startsWith(needle),
      )
      if (!value) {
        push('out', `no such objective: ${argument || '—'}. try 'objectives'.`)
        return
      }
      push('accent', value.title.toLowerCase() + ' — ' + value.line)
      push('out', value.detail)
      return
    }

    if (key === 'objectives' || key === 'values') {
      values.forEach((value) => push('out', `${value.id.padEnd(14)} ${value.title}`))
      return
    }

    if (key === 'departments' || key === 'depts') {
      departments.forEach((department) =>
        push('out', `${department.name.padEnd(14)} ${department.focus}`),
      )
      return
    }

    if (key === 'stats' || key === 'stat') {
      push('muted', 'figures from the club presentation')
      stats.forEach((stat) => push('out', `${String(stat.value).padStart(4, ' ')}  ${stat.label}`))
      return
    }

    if (key === 'whoami') {
      push('out', 'guest — visiting the public archive. no account needed.')
      return
    }

    if (key === 'contact') {
      push('out', site.contactNote)
      return
    }

    if (key === 'sudo') {
      push('out', 'nice try. this shell belongs to Shellmates.')
      return
    }

    push('out', `command not found: ${name}. type 'help'.`)
  }, [])

  /* when a value is chosen on the left, run its command here */
  useEffect(() => {
    if (!selectedValue || lastValue.current === selectedValue.id) return
    lastValue.current = selectedValue.id
    run(`objective ${selectedValue.id}`)
  }, [selectedValue, run])

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [lines])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const command = input.trim()
    if (!command) return
    history.current = [...history.current, command].slice(-30)
    historyIndex.current = history.current.length
    run(command)
    setInput('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      historyIndex.current = Math.max(0, historyIndex.current - 1)
      setInput(history.current[historyIndex.current] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1)
      setInput(history.current[historyIndex.current] ?? '')
    }
  }

  const runChip = (command: string) => {
    run(command)
    inputRef.current?.focus()
  }

  return (
    <section className="terminal" aria-label="Showmate terminal">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <b>guest@showmate — bash</b>
        <span>showmate 1.0</span>
      </div>

      <div
        className="terminal-body"
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((line) => (
          <span key={line.id} className={`t-line t-${line.kind}`}>
            {line.text}
          </span>
        ))}
      </div>

      <form className="terminal-form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="terminal-input">
          Terminal command
        </label>
        <span className="terminal-prompt" aria-hidden="true">
          guest@showmate:~$
        </span>
        <input
          id="terminal-input"
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby="terminal-hint"
        />
      </form>

      <div className="terminal-chips" id="terminal-hint">
        {quickChips.map((command) => (
          <button
            key={command}
            type="button"
            className="chip"
            onClick={() => runChip(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </section>
  )
}
