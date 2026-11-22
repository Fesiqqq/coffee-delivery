import { useEffect, useState } from 'react'

/**
 * Lê um valor JSON do localStorage com validação (RNF-04): se o conteúdo estiver
 * ausente, corrompido ou com formato inesperado, devolve `fallback`.
 */
export function readStorage<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota cheia ou modo privado: a aplicação continua funcionando sem persistir.
  }
}

/** `useState` sincronizado com o localStorage. */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    const fallback = initialValue instanceof Function ? initialValue() : initialValue
    return readStorage(key, fallback, isValid)
  })

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
