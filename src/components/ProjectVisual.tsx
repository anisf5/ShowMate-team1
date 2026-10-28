import type { ProjectVisual as ProjectVisualSpec } from '../data/projects'

type Props = {
  visual: ProjectVisualSpec
  className?: string
}

function PathBody({ visual }: { visual: ProjectVisualSpec }) {
  return (
    <div className="viz-path">
      {visual.rows.map((row, index) => (
        <div className="viz-module" key={row.label}>
          <span className="viz-module-index">{String(index + 1).padStart(2, '0')}</span>
          <b>{row.label}</b>
          <em>{row.note}</em>
        </div>
      ))}
    </div>
  )
}

function AttackBody({ visual }: { visual: ProjectVisualSpec }) {
  return (
    <div className="viz-attack">
      <div className="viz-attack-row">
        <span className="viz-tag">attacker</span>
        <span className="viz-arrow" aria-hidden="true">
          →
        </span>
        <span className="viz-tag viz-tag--hot">target</span>
      </div>

      <div className="viz-chain">
        {visual.rows.map((row, index) => (
          <div className="viz-step" key={row.label}>
            <i>{String(index + 1).padStart(2, '0')}</i>
            <span>{row.label}</span>
          </div>
        ))}
      </div>

      <div className="viz-log">
        <span>
          <b>lab</b> {visual.status}
        </span>
        <span>
          <b>lab</b> chain: {visual.rows.length} stages
        </span>
      </div>
    </div>
  )
}

function BriefBody({ visual }: { visual: ProjectVisualSpec }) {
  return (
    <div className="viz-brief">
      {visual.rows.map((row) => (
        <div className="viz-brief-row" key={row.label}>
          <span>{row.label}</span>
          <em>{row.note}</em>
          {row.value && <b>{row.value}</b>}
        </div>
      ))}
    </div>
  )
}

function ChecklistBody({ visual }: { visual: ProjectVisualSpec }) {
  return (
    <div className="viz-check">
      {visual.rows.map((row) => (
        <div className="viz-check-row" key={row.label}>
          <i className="viz-mark" aria-hidden="true" />
          <span>{row.label}</span>
          <em>{row.note}</em>
          {row.value && <b>{row.value}</b>}
        </div>
      ))}
    </div>
  )
}

const bodies = {
  path: PathBody,
  attack: AttackBody,
  brief: BriefBody,
  checklist: ChecklistBody,
}

/**
 * Drawn record previews: small pieces of interface rather than stock
 * photography standing in for work that does not exist yet.
 */
export default function ProjectVisual({ visual, className }: Props) {
  const Body = bodies[visual.id]

  return (
    <div className={className}>
      <div className="viz" data-ui aria-hidden="true">
        <div className="viz-bar">
          <span className="viz-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{visual.file}</span>
          <span className="viz-ok">{visual.status}</span>
        </div>

        <div className="viz-body">
          <span className="viz-line viz-dim">{visual.command}</span>
          <Body visual={visual} />
          <div className="viz-line viz-dim viz-footline">{visual.foot}</div>
        </div>
      </div>
    </div>
  )
}
