import { createContext, useContext } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useWeightUnit } from '../hooks/useWeightUnit'
import { useBackupReminder } from '../hooks/useBackupReminder'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const theme = useTheme()
  const weightUnit = useWeightUnit()
  const backup = useBackupReminder()

  return (
    <AppContext.Provider value={{ ...theme, ...weightUnit, ...backup }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
