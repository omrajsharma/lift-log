import { useApp } from '../context/AppContext'
import Button from './Button'

export default function UpdateBanner() {
  const { isUpdateAvailable, applyUpdate } = useApp()

  if (!isUpdateAvailable) return null

  return (
    <div className="border-b border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-900 dark:bg-blue-950/50">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
          New version available 🚀
        </p>
        <Button onClick={applyUpdate} className="shrink-0 px-3 py-1.5 text-sm">
          Update Now
        </Button>
      </div>
    </div>
  )
}
