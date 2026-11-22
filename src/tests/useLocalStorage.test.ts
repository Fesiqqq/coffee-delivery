import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readStorage, useLocalStorage } from '../hooks/useLocalStorage'
import { isThemeMode } from '../utils/guards'

describe('useLocalStorage (RF-06, RNF-04)', () => {
  it('lê o valor salvo', () => {
    localStorage.setItem('k', JSON.stringify('dark'))
    const { result } = renderHook(() => useLocalStorage('k', 'light', isThemeMode))
    expect(result.current[0]).toBe('dark')
  })

  it('usa o fallback quando o JSON está corrompido', () => {
    localStorage.setItem('k', '{nao é json')
    expect(readStorage('k', 'light', isThemeMode)).toBe('light')
  })

  it('usa o fallback quando o formato é inesperado', () => {
    localStorage.setItem('k', JSON.stringify('roxo'))
    expect(readStorage('k', 'light', isThemeMode)).toBe('light')
  })

  it('grava as alterações', () => {
    const { result } = renderHook(() => useLocalStorage<'light' | 'dark'>('k', 'light', isThemeMode))
    act(() => result.current[1]('dark'))
    expect(JSON.parse(localStorage.getItem('k')!)).toBe('dark')
  })
})
