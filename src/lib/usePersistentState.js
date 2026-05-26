import { useEffect, useRef, useState } from 'react'

const PREFIX = 'roi1.'

/* useState qui se synchronise dans localStorage (démo persistée entre sessions). */
export function usePersistentState(key, initial) {
  const storageKey = PREFIX + key
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw != null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  // Évite d'écrire au tout premier rendu (valeur déjà chargée).
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      /* stockage indisponible */
    }
  }, [storageKey, value])

  return [value, setValue]
}

export function clearPersistedState() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) || k === 'roi_onboarded')
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* stockage indisponible */
  }
}
