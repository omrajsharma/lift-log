import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../db/operations'
import WeeklySummary from '../components/WeeklySummary'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const load = () => getCategories().then(setCategories)

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setName('')
    setModal({ mode: 'create' })
  }

  const openEdit = (cat) => {
    setName(cat.name)
    setModal({ mode: 'edit', id: cat.id })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (modal.mode === 'create') {
      await createCategory(name)
    } else {
      await updateCategory(modal.id, name)
    }
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    await deleteCategory(deleteId)
    setDeleteId(null)
    load()
  }

  return (
    <>
      <WeeklySummary />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button onClick={openCreate}>+ Add</Button>
      </div>

      {categories.length === 0 ? (
        <p className="py-8 text-center text-neutral-500">
          No categories yet. Add one to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              <Link
                to={`/category/${cat.id}`}
                className="flex-1 px-4 py-3.5 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                {cat.name}
              </Link>
              <button
                type="button"
                onClick={() => openEdit(cat)}
                className="px-2 py-3 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(cat.id)}
                className="px-3 py-3 text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'New category' : 'Rename category'}
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
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this category and all its exercises and logs?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  )
}
