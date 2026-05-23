import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  getCategories,
  getExercisesByCategory,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../db/operations'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

export default function CategoryView() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [exercises, setExercises] = useState([])
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const load = async () => {
    const cats = await getCategories()
    const cat = cats.find((c) => c.id === categoryId)
    if (!cat) {
      navigate('/')
      return
    }
    setCategory(cat)
    setExercises(await getExercisesByCategory(categoryId))
  }

  useEffect(() => {
    load()
  }, [categoryId])

  const openCreate = () => {
    setName('')
    setNotes('')
    setModal({ mode: 'create' })
  }

  const openEdit = (ex) => {
    setName(ex.name)
    setNotes(ex.notes || '')
    setModal({ mode: 'edit', id: ex.id })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (modal.mode === 'create') {
      await createExercise(categoryId, name, notes)
    } else {
      await updateExercise(modal.id, { name, notes })
    }
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    await deleteExercise(deleteId)
    setDeleteId(null)
    load()
  }

  if (!category) return null

  return (
    <>
      <Link to="/" className="mb-4 inline-block text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200">
        ← Back
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{category.name}</h1>
        <Button onClick={openCreate}>+ Exercise</Button>
      </div>

      {exercises.length === 0 ? (
        <p className="py-8 text-center text-neutral-500">No exercises yet.</p>
      ) : (
        <ul className="space-y-2">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              <Link
                to={`/exercise/${ex.id}`}
                className="flex-1 px-4 py-3.5 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                {ex.name}
              </Link>
              <button
                type="button"
                onClick={() => openEdit(ex)}
                className="px-2 py-3 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(ex.id)}
                className="px-3 py-3 text-sm text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'New exercise' : 'Edit exercise'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
            <Input
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this exercise and all its logs?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  )
}
