import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

const Button = styled.button`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentStrong};
  transition: filter 0.15s;

  &:hover {
    filter: brightness(0.95);
  }
`

/** Alternância acessível de tema (RF-14): `aria-pressed` indica o estado atual. */
export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()
  const isDark = mode === 'dark'

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Modo escuro"
      title={isDark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'}
    >
      {isDark ? <SunIcon size={22} weight="fill" aria-hidden /> : <MoonIcon size={22} weight="fill" aria-hidden />}
    </Button>
  )
}
