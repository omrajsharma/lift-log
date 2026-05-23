import Dexie from 'dexie'

export const db = new Dexie('StrengthTracker')

db.version(1).stores({
  categories: 'id, name',
  exercises: 'id, categoryId, name',
  logs: 'id, exerciseId, timestamp',
})
