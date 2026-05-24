import { Link, useLocation } from 'react-router-dom'
import BackupBanner from './BackupBanner'
import UpdateBanner from './UpdateBanner'

export default function Layout({ children }) {
  const location = useLocation()
  const isSettings = location.pathname === '/settings'

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <img src="/pwa-192.png" alt="" className="h-8 w-8 rounded-lg" />
            Strength Tracker
          </Link>
          <Link
            to="/settings"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isSettings
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            Settings
          </Link>
        </div>
      </header>

      <UpdateBanner />
      <BackupBanner />

      <main className="flex-1 px-4 py-4">{children}</main>
    </div>
  )
}
