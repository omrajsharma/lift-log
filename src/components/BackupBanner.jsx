import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function BackupBanner() {
  const { showBanner, dismiss } = useApp()

  if (!showBanner) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-900 dark:bg-amber-950/50">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          Backup your data to avoid loss.{' '}
          <Link to="/settings" className="font-medium underline">
            Export now
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-amber-700 hover:text-amber-900 dark:text-amber-400"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
