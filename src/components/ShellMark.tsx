type Props = {
  size?: number
  className?: string
}

/** The Shellmates mark: a prompt inside a terminal frame. */
export default function ShellMark({ size = 26, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.5" y="0.5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8.5 11 13l-5 4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M13.5 17.5H20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
