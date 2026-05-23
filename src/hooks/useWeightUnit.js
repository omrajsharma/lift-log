import { useState } from 'react'

const STORAGE_KEY = 'strength_tracker_unit'

function getInitialUnit() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'lb' ? 'lb' : 'kg'
}

export function useWeightUnit() {
  const [unit, setUnitState] = useState(getInitialUnit)

  const setUnit = (newUnit) => {
    setUnitState(newUnit)
    localStorage.setItem(STORAGE_KEY, newUnit)
  }

  const toggle = () => setUnit(unit === 'kg' ? 'lb' : 'kg')

  return { unit, setUnit, toggle }
}
