import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  exportAllData,
  replaceAllData,
  mergeData,
  clearAllData,
} from '../db/operations'
import {
  buildExportPayload,
  validateImportData,
  downloadJson,
  readJsonFile,
} from '../utils/exportImport'
import { useApp } from '../context/AppContext'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'

export default function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme, isDark, unit, setUnit, onExported } = useApp()
  const fileRef = useRef(null)

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [importModal, setImportModal] = useState(null)
  const [importError, setImportError] = useState('')
  const [status, setStatus] = useState('')

  const handleExport = async () => {
    const data = await exportAllData()
    const payload = buildExportPayload(data.categories, data.exercises, data.logs)
    downloadJson(payload)
    onExported()
    setStatus('Data exported successfully.')
    setTimeout(() => setStatus(''), 3000)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    try {
      const data = await readJsonFile(file)
      const result = validateImportData(data)
      if (!result.valid) {
        setImportError(result.error)
        return
      }
      setImportError('')
      setImportModal({ data })
    } catch {
      setImportError('Could not parse JSON file.')
    }
  }

  const handleImport = async (mode) => {
    const { data } = importModal
    const payload = {
      categories: data.categories,
      exercises: data.exercises,
      logs: data.logs,
    }
    if (mode === 'replace') {
      await replaceAllData(payload)
    } else {
      await mergeData(payload)
    }
    setImportModal(null)
    setStatus(`Data ${mode === 'replace' ? 'replaced' : 'merged'} successfully.`)
    setTimeout(() => setStatus(''), 3000)
    navigate('/')
  }

  const handleClear = async () => {
    await clearAllData()
    setShowClearConfirm(false)
    navigate('/')
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">Settings</h1>

      {status && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
          {status}
        </p>
      )}

      <section className="mb-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="font-medium">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Dark mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              isDark ? 'bg-neutral-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Weight unit</span>
          <div className="flex rounded-lg border border-neutral-300 dark:border-neutral-700">
            {['kg', 'lb'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 text-sm font-medium ${
                  unit === u
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6 space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="font-medium">Data</h2>
        <Button variant="secondary" className="w-full" onClick={handleExport}>
          Export JSON
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
          Import JSON
        </Button>
        {importError && <p className="text-sm text-red-600">{importError}</p>}
        <Button variant="danger" className="w-full" onClick={() => setShowClearConfirm(true)}>
          Clear All Data
        </Button>
      </section>

      <p className="text-center text-xs text-neutral-500">
        All data is stored locally on your device.
      </p>

      {showClearConfirm && (
        <ConfirmDialog
          message="This will permanently delete all your data. Are you sure?"
          onConfirm={handleClear}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

      {importModal && (
        <Modal title="Import data" onClose={() => setImportModal(null)}>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            {importModal.data.categories.length} categories,{' '}
            {importModal.data.exercises.length} exercises, {importModal.data.logs.length} logs
          </p>
          <div className="space-y-2">
            <Button className="w-full" onClick={() => handleImport('replace')}>
              Replace all data
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => handleImport('merge')}>
              Merge with existing
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
