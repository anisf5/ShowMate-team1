import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

import { site } from '../data/site'

type Props = {
  open: boolean
  onClose: () => void
}

const pendingChannels = [
  { label: 'GitHub', handle: 'link pending' },
  { label: 'Instagram', handle: 'link pending' },
  { label: 'Email', handle: 'link pending' },
]

export default function ContactDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      setCopyStatus('')
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyStatus('Link copied.')
    } catch {
      setCopyStatus('Copy failed — use the address bar.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contact-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
    >
      <div className="dialog-head">
        <h2 id="contact-title">Connect with Shellmates</h2>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="dialog-body">
        <p>
          This build was made without verified Shellmates channels, so it does not link to any.
          Send the club a real address, GitHub or social profile and it drops straight in.
        </p>

        <div className="channel-list">
          {site.channels.length
            ? site.channels.map((channel) => (
                <a key={channel.label} className="channel" href={channel.href}>
                  <span>{channel.label}</span>
                  <span>{channel.handle}</span>
                </a>
              ))
            : pendingChannels.map((channel) => (
                <span key={channel.label} className="channel">
                  <span>{channel.label}</span>
                  <span>{channel.handle}</span>
                </span>
              ))}
        </div>

        <p className="meta">{site.contactNote}</p>

        <div className="dialog-actions">
          <button type="button" className="btn" onClick={copyLink}>
            Copy link to Showmate
          </button>
          <a className="btn btn--dark" href="#structure" onClick={onClose}>
            See the structure
          </a>
        </div>

        <p className="meta" role="status" aria-live="polite">
          {copyStatus}
        </p>
      </div>
    </dialog>
  )
}
