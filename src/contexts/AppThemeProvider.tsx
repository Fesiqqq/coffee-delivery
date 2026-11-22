import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { GlobalStyle } from '../styles/global'
import { themes, type ThemeMode } from '../styles/themes'
import { isThemeMode } from '../utils/guards'
import { STORAGE_KEYS } from '../utils/storage-keys'
import { ThemeContext } from './ThemeContext'

/** Sem escolha salva, segue a preferência do sistema (prefers-color-scheme). */
function getSystemTheme(): ThemeMode {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useLocalStorage<ThemeMode>(STORAGE_KEYS.theme, getSystemTheme, isThemeMode)

  const toggleTheme = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setMode])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = mode
    root.style.colorScheme = mode
    root.style.backgroundColor = themes[mode].colors.background
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themes[mode].colors.background)
  }, [mode])

  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={themes[mode]}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
