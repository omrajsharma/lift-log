import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  getExercise,
  getCategories,
  getLogsByExercise,
  createLog,
  deleteLog,
  getPersonalRecord,
} from '../db/operations'
import { useApp } from '../context/AppContext'
import Button from '../components/Button'
import Input from '../components/Input'
import WeightChart from '../components/WeightChart'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ExerciseView() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const { unit } = useApp()

  const [exercise, setExercise] = useState(null)
  const [category, setCategory] = useState(null)
  const [logs, setLogs] = useState([])
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [deleteLogId, setDeleteLogId] = useState(null)

  const pr = getPersonalRecord(logs)
  const lastLog = logs[0]

  const load = async () => {
    const ex = await getExercise(exerciseId)
    if (!ex) {
      navigate('/')
      return
    }
    setExercise(ex)
    const cats = await getCategories()
    setCategory(cats.find((c) => c.id === ex.categoryId))
    const logList = await getLogsByExercise(exerciseId)
    setLogs(logList)
    if (logList[0] && !weight) {
      setWeight(String(logList[0].weight))
    }
  }

  useEffect(() => {
    load()
  }, [exerciseId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return
    await createLog(exerciseId, w, r)
    setReps('')
    load()
  }

  const quickAdd = async () => {
    if (!lastLog) return
    const r = parseInt(reps, 10)
    if (isNaN(r) || r <= 0) return
    await createLog(exerciseId, lastLog.weight, r)
    setReps('')
    load()
  }

  const handleDeleteLog = async () => {
    await deleteLog(deleteLogId)
    setDeleteLogId(null)
    load()
  }

  if (!exercise) return null

  return (
    <>
      <Link
        to={`/category/${exercise.categoryId}`}
        className="mb-4 inline-block text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        ← {category?.name || 'Back'}
      </Link>

      <h1 className="mb-1 text-xl font-semibold">{exercise.name}</h1>
      {exercise.notes && (
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">{exercise.notes}</p>
      )}

      {pr && (
        <div className="mb-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Personal record</p>
          <p className="text-lg font-semibold">
            {pr.weight} {unit} × {pr.reps} reps
          </p>
        </div>
      )}

      <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 font-medium">Log set</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Weight (${unit})`}
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <Input
              label="Reps"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Add log
            </Button>
            {lastLog && (
              <Button
                type="button"
                variant="secondary"
                onClick={quickAdd}
                disabled={!reps}
                title={`Repeat ${lastLog.weight} ${unit}`}
              >
                Quick ({lastLog.weight})
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 font-medium">Progress</h2>
        <WeightChart logs={logs} />
      </section>

      <section>
        <h2 className="mb-3 font-medium">Recent logs</h2>
        {logs.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800"
              >
                <div>
                  <span className="font-medium">
                    {log.weight} {unit} × {log.reps}
                  </span>
                  <span className="ml-2 text-sm text-neutral-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteLogId(log.id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {deleteLogId && (
        <ConfirmDialog
          message="Delete this log entry?"
          onConfirm={handleDeleteLog}
          onCancel={() => setDeleteLogId(null)}
        />
      )}
    </>
  )
}
