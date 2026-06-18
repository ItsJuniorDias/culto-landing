import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * State persisted to localStorage. This is the project's "backend":
 * accounts, sessions and the asset library all live in the browser.
 *
 * - Lazily reads the initial value once.
 * - Writes back on every change.
 * - Stays in sync across tabs via the `storage` event.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const [value, setValue] = useState(readValue)
  const keyRef = useRef(key)
  keyRef.current = key

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [key, value])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === keyRef.current && e.newValue != null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch {
          /* ignore malformed */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return [value, setValue]
}
