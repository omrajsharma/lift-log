import { db } from './database'
import { uuid } from '../utils/uuid'

// Categories
export async function getCategories() {
  return db.categories.orderBy('name').toArray()
}

export async function createCategory(name) {
  const category = { id: uuid(), name: name.trim() }
  await db.categories.add(category)
  return category
}

export async function updateCategory(id, name) {
  await db.categories.update(id, { name: name.trim() })
}

export async function deleteCategory(id) {
  const exercises = await db.exercises.where('categoryId').equals(id).toArray()
  const exerciseIds = exercises.map((e) => e.id)
  await db.transaction('rw', db.categories, db.exercises, db.logs, async () => {
    if (exerciseIds.length) {
      await db.logs.where('exerciseId').anyOf(exerciseIds).delete()
    }
    await db.exercises.where('categoryId').equals(id).delete()
    await db.categories.delete(id)
  })
}

// Exercises
export async function getExercisesByCategory(categoryId) {
  return db.exercises.where('categoryId').equals(categoryId).sortBy('name')
}

export async function getExercise(id) {
  return db.exercises.get(id)
}

export async function createExercise(categoryId, name, notes = '') {
  const exercise = {
    id: uuid(),
    name: name.trim(),
    categoryId,
    notes: notes.trim() || undefined,
  }
  await db.exercises.add(exercise)
  return exercise
}

export async function updateExercise(id, { name, notes }) {
  const updates = { name: name.trim() }
  const trimmedNotes = notes?.trim()
  updates.notes = trimmedNotes || undefined
  await db.exercises.update(id, updates)
}

export async function deleteExercise(id) {
  await db.transaction('rw', db.exercises, db.logs, async () => {
    await db.logs.where('exerciseId').equals(id).delete()
    await db.exercises.delete(id)
  })
}

// Logs
export async function getLogsByExercise(exerciseId) {
  return db.logs.where('exerciseId').equals(exerciseId).reverse().sortBy('timestamp')
}

export async function createLog(exerciseId, weight, reps) {
  const log = {
    id: uuid(),
    exerciseId,
    weight: Number(weight),
    reps: Number(reps),
    timestamp: Date.now(),
  }
  await db.logs.add(log)
  return log
}

export async function deleteLog(id) {
  await db.logs.delete(id)
}

export function getPersonalRecord(logs) {
  if (!logs.length) return null
  return logs.reduce((max, log) => (log.weight > max.weight ? log : max), logs[0])
}

// Export / import
export async function exportAllData() {
  const [categories, exercises, logs] = await Promise.all([
    db.categories.toArray(),
    db.exercises.toArray(),
    db.logs.toArray(),
  ])
  return { categories, exercises, logs }
}

export async function replaceAllData({ categories, exercises, logs }) {
  await db.transaction('rw', db.categories, db.exercises, db.logs, async () => {
    await db.categories.clear()
    await db.exercises.clear()
    await db.logs.clear()
    if (categories.length) await db.categories.bulkAdd(categories)
    if (exercises.length) await db.exercises.bulkAdd(exercises)
    if (logs.length) await db.logs.bulkAdd(logs)
  })
}

export async function mergeData({ categories, exercises, logs }) {
  const [existingCats, existingEx, existingLogs] = await Promise.all([
    db.categories.toArray(),
    db.exercises.toArray(),
    db.logs.toArray(),
  ])

  const catIds = new Set(existingCats.map((c) => c.id))
  const exIds = new Set(existingEx.map((e) => e.id))
  const logIds = new Set(existingLogs.map((l) => l.id))

  const newCats = categories.filter((c) => !catIds.has(c.id))
  const newEx = exercises.filter((e) => !exIds.has(e.id))
  const newLogs = logs.filter((l) => !logIds.has(l.id))

  await db.transaction('rw', db.categories, db.exercises, db.logs, async () => {
    if (newCats.length) await db.categories.bulkAdd(newCats)
    if (newEx.length) await db.exercises.bulkAdd(newEx)
    if (newLogs.length) await db.logs.bulkAdd(newLogs)
  })
}

export async function clearAllData() {
  await db.transaction('rw', db.categories, db.exercises, db.logs, async () => {
    await db.categories.clear()
    await db.exercises.clear()
    await db.logs.clear()
  })
}

// Weekly summary
export async function getWeeklySummary() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentLogs = await db.logs.where('timestamp').above(sevenDaysAgo).toArray()

  if (!recentLogs.length) {
    return { totalWorkouts: 0, mostTrainedExercise: null }
  }

  const counts = {}
  for (const log of recentLogs) {
    counts[log.exerciseId] = (counts[log.exerciseId] || 0) + 1
  }

  let topExerciseId = null
  let topCount = 0
  for (const [exerciseId, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count
      topExerciseId = exerciseId
    }
  }

  const exercise = topExerciseId ? await db.exercises.get(topExerciseId) : null

  return {
    totalWorkouts: recentLogs.length,
    mostTrainedExercise: exercise?.name ?? null,
  }
}
