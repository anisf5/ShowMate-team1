import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import { projects } from '../data/projects'

type Props = {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((project) =>
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
        .includes(q),
    )
  }, [query])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      requestAnimationFrame(() => inputRef.current?.focus())
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const option = list.querySelector<HTMLElement>(`[data-index="${active}"]`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = useCallback(
    (slug: string) => {
      onClose()
      navigate(`/projects/${slug}`)
    },
    [navigate, onClose],
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => (results.length ? (index + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const project = results[active]
      if (project) go(project.slug)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Search records"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
    >
      <div className="palette-field">
        <Search size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          className="palette-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search 22 records, topics, types"
          aria-label="Search records"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `palette-opt-${results[active].slug}` : undefined}
          autoComplete="off"
        />
        <span className="palette-hint">esc</span>
      </div>

      <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
        {results.map((project, index) => (
          <li
            key={project.slug}
            id={`palette-opt-${project.slug}`}
            role="option"
            aria-selected={index === active}
            data-index={index}
            className="palette-item"
            onMouseEnter={() => setActive(index)}
            onClick={() => go(project.slug)}
          >
            <span>{project.name}</span>
            <span>{project.group}</span>
          </li>
        ))}
        {!results.length && (
          <li className="palette-empty">
            No record matches “{query}”. Try “skills”, “web” or “event”.
          </li>
        )}
      </ul>
    </dialog>
  )
}
