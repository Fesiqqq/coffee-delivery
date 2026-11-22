import type { ComponentProps, ReactNode } from 'react'
import styled from 'styled-components'

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;

  label {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.title};

    small {
      font-weight: 400;
      font-style: italic;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`

const InputBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.radii.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.input};
    color: ${({ theme }) => theme.colors.title};
    font-size: 0.875rem;
    transition: border-color 0.15s;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.brandStrong};
    }

    &[aria-invalid='true'] {
      border-color: ${({ theme }) => theme.colors.danger};
      border-width: 2px;
    }
  }

  > span {
    position: absolute;
    right: 0.75rem;
    pointer-events: none;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Message = styled.p<{ $variant: 'error' | 'hint' }>`
  font-size: 0.75rem;
  color: ${({ theme, $variant }) => ($variant === 'error' ? theme.colors.danger : theme.colors.textMuted)};
`

interface TextFieldProps extends ComponentProps<'input'> {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  adornment?: ReactNode
}

/** Campo com label associado e erro anunciado por aria-describedby (RNF-01). */
export function TextField({ id, label, error, hint, optional, adornment, className, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-erro`
  const hintId = `${id}-dica`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <Field className={className}>
      <label htmlFor={id}>
        {label} {optional && <small>(opcional)</small>}
      </label>
      <InputBox>
        <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...inputProps} />
        {adornment && <span>{adornment}</span>}
      </InputBox>
      {hint && (
        <Message $variant="hint" id={hintId} aria-live="polite">
          {hint}
        </Message>
      )}
      {error && (
        <Message $variant="error" id={errorId}>
          {error}
        </Message>
      )}
    </Field>
  )
}
