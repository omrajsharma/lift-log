import { useCallback, useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function usePwaUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const registrationRef = useRef(null)
  const reloadingRef = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const onUpdateFound = (registration) => {
      const worker = registration.installing
      if (!worker) return

      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          registrationRef.current = registration
          setIsUpdateAvailable(true)
        }
      })
    }

    const checkWaiting = (registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        registrationRef.current = registration
        setIsUpdateAvailable(true)
      }
    }

    registerSW({
      immediate: true,
      onRegistered(registration) {
        if (!registration) return
        registrationRef.current = registration
        checkWaiting(registration)
        registration.addEventListener('updatefound', () => onUpdateFound(registration))
      },
      onNeedRefresh() {
        setIsUpdateAvailable(true)
      },
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadingRef.current) return
      reloadingRef.current = true
      window.location.reload()
    })
  }, [])

  const applyUpdate = useCallback(() => {
    const registration = registrationRef.current
    const waiting = registration?.waiting
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [])

  return { isUpdateAvailable, applyUpdate }
}
