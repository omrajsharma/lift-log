import { createContext, useContext } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useWeightUnit } from '../hooks/useWeightUnit'
import { useBackupReminder } from '../hooks/useBackupReminder'
import { usePwaUpdate } from '../hooks/usePwaUpdate'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const theme = useTheme()
  const weightUnit = useWeightUnit()
  const backup = useBackupReminder()
  const pwaUpdate = usePwaUpdate()

  return (
    <AppContext.Provider value={{ ...theme, ...weightUnit, ...backup, ...pwaUpdate }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
