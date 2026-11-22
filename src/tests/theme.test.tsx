import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../utils/storage-keys'
import { renderApp } from './renderApp'

describe('tema claro/escuro (RF-14)', () => {
  it('alterna, aplica no documento e persiste', async () => {
    const { user, unmount } = await renderApp('/')
    const toggle = screen.getByRole('button', { name: 'Modo escuro' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme)!)).toBe('dark')

    unmount()
    await renderApp('/checkout')
    expect(screen.getByRole('button', { name: 'Modo escuro' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('usa prefers-color-scheme quando não há escolha salva', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) => ({ matches: query.includes('dark'), media: query }) as MediaQueryList,
    )
    await renderApp('/')
    expect(screen.getByRole('button', { name: 'Modo escuro' })).toHaveAttribute('aria-pressed', 'true')
  })
})
