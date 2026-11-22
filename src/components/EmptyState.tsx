import type { ReactNode } from 'react'
import styled from 'styled-components'
import { PrimaryLink } from './ui'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }

  h2,
  h3 {
    font-size: 1.25rem;
  }
`

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  headingLevel?: 'h2' | 'h3'
  action?: { to: string; label: string }
}

/** Estados vazios (RN-09): carrinho sem itens e sucesso sem pedido. */
export function EmptyState({ icon, title, description, headingLevel = 'h2', action }: EmptyStateProps) {
  const Heading = headingLevel
  return (
    <Box>
      {icon}
      <Heading>{title}</Heading>
      <p>{description}</p>
      {action && <PrimaryLink to={action.to}>{action.label}</PrimaryLink>}
    </Box>
  )
}
