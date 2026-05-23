const EXPORT_VERSION = 1

export function buildExportPayload(categories, exercises, logs) {
  return {
    version: EXPORT_VERSION,
    exportedAt: Date.now(),
    categories,
    exercises,
    logs,
  }
}

function isValidItem(item, requiredKeys) {
  if (!item || typeof item !== 'object') return false
  return requiredKeys.every((key) => key in item)
}

export function validateImportData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid JSON structure' }
  }

  if (!Array.isArray(data.categories) || !Array.isArray(data.exercises) || !Array.isArray(data.logs)) {
    return { valid: false, error: 'Missing categories, exercises, or logs arrays' }
  }

  for (const c of data.categories) {
    if (!isValidItem(c, ['id', 'name']) || typeof c.name !== 'string') {
      return { valid: false, error: 'Invalid category entry' }
    }
  }

  for (const e of data.exercises) {
    if (!isValidItem(e, ['id', 'name', 'categoryId']) || typeof e.name !== 'string') {
      return { valid: false, error: 'Invalid exercise entry' }
    }
    if (e.notes !== undefined && typeof e.notes !== 'string') {
      return { valid: false, error: 'Invalid exercise notes' }
    }
  }

  for (const l of data.logs) {
    if (
      !isValidItem(l, ['id', 'exerciseId', 'weight', 'reps', 'timestamp']) ||
      typeof l.weight !== 'number' ||
      typeof l.reps !== 'number' ||
      typeof l.timestamp !== 'number'
    ) {
      return { valid: false, error: 'Invalid log entry' }
    }
  }

  return { valid: true }
}

export function downloadJson(data, filename = 'strength-tracker-backup.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function readJsonFile(file) {
  const text = await file.text()
  return JSON.parse(text)
}
