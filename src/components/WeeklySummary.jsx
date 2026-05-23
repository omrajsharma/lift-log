import { useEffect, useState } from 'react'
import { getWeeklySummary } from '../db/operations'

export default function WeeklySummary() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getWeeklySummary().then(setSummary)
  }, [])

  if (!summary) return null

  return (
    <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Last 7 days
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold">{summary.totalWorkouts}</p>
          <p className="text-sm text-neutral-500">Total sets logged</p>
        </div>
        <div>
          <p className="truncate text-lg font-semibold">
            {summary.mostTrainedExercise || '—'}
          </p>
          <p className="text-sm text-neutral-500">Most trained</p>
        </div>
      </div>
    </section>
  )
}
