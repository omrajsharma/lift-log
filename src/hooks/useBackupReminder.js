import { useEffect, useState } from 'react'

const OPEN_COUNT_KEY = 'strength_tracker_open_count'
const LAST_REMINDER_KEY = 'strength_tracker_last_reminder'
const DISMISSED_KEY = 'strength_tracker_reminder_dismissed'

const OPEN_THRESHOLD = 10
const DAY_THRESHOLD = 7
const DAY_MS = 24 * 60 * 60 * 1000

export function useBackupReminder() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const count = parseInt(localStorage.getItem(OPEN_COUNT_KEY) || '0', 10) + 1
    localStorage.setItem(OPEN_COUNT_KEY, String(count))

    const lastReminder = parseInt(localStorage.getItem(LAST_REMINDER_KEY) || '0', 10)
    const dismissedAt = parseInt(localStorage.getItem(DISMISSED_KEY) || '0', 10)
    const now = Date.now()

    const daysSinceDismiss = (now - dismissedAt) / DAY_MS
    const daysSinceReminder = (now - lastReminder) / DAY_MS

    const shouldShow =
      count >= OPEN_THRESHOLD ||
      (lastReminder > 0 && daysSinceReminder >= DAY_THRESHOLD) ||
      (lastReminder === 0 && count >= 3)

    if (shouldShow && daysSinceDismiss >= 1) {
      localStorage.setItem(LAST_REMINDER_KEY, String(now))
      setShowBanner(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    setShowBanner(false)
  }

  const onExported = () => {
    localStorage.setItem(OPEN_COUNT_KEY, '0')
    localStorage.setItem(LAST_REMINDER_KEY, String(Date.now()))
    setShowBanner(false)
  }

  return { showBanner, dismiss, onExported }
}
