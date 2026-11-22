import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const primary = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.onBrand};
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  text-decoration: none;
  transition: filter 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }

  &:disabled {
    opacity: 0.55;
  }
`

export const PrimaryLink = styled(Link)`
  ${primary}
`

export const PrimaryButton = styled.button`
  ${primary}
`

/** Superfície usada nos blocos do checkout e da tela de sucesso. */
export const Panel = styled.section`
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

export const PanelHeader = styled.header<{ $tone?: 'brandStrong' | 'accent' }>`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;

  > svg {
    flex-shrink: 0;
    color: ${({ theme, $tone = 'brandStrong' }) => theme.colors[$tone]};
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.text};
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.title};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`
