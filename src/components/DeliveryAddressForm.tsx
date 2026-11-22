import { CircleNotchIcon, MapPinLineIcon } from '@phosphor-icons/react'
import { useCallback, type ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import styled, { keyframes } from 'styled-components'
import { CEP_MESSAGES, useCepLookup } from '../hooks/useCepLookup'
import type { CheckoutFormInput } from '../schemas/checkout'
import type { CepAddress } from '../services/viaCep'
import { formatCep, isCompleteCep } from '../utils/cep'
import { TextField } from './TextField'
import { Panel, PanelHeader } from './ui'

const spin = keyframes`to { transform: rotate(360deg); }`

const Grid = styled.div`
  display: grid;
  gap: 1rem 0.75rem;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  > * {
    grid-column: span 6;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    .cep { grid-column: span 3; }
    .number { grid-column: span 2; }
    .complement { grid-column: span 4; }
    .neighborhood { grid-column: span 3; }
    .city { grid-column: span 2; }
    .uf { grid-column: span 1; }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    .cep { grid-column: span 2; }
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`

const CepStatus = styled.p<{ $error: boolean }>`
  grid-column: span 6 !important;
  margin-top: -0.5rem;
  font-size: 0.75rem;
  color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.textMuted)};
`

/**
 * Endereço de entrega (RF-08). Ao completar 8 dígitos no CEP, consulta o ViaCEP e
 * preenche rua, bairro, cidade e UF. Número e complemento ficam para o usuário.
 */
export function DeliveryAddressForm() {
  const {
    register,
    setValue,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useFormContext<CheckoutFormInput>()

  const fillAddress = useCallback(
    (address: CepAddress) => {
      const options = { shouldValidate: true, shouldDirty: true } as const
      // Só sobrescreve quando a API retornou o dado (CEPs gerais podem vir sem rua/bairro).
      if (address.street) setValue('street', address.street, options)
      if (address.neighborhood) setValue('neighborhood', address.neighborhood, options)
      if (address.city) setValue('city', address.city, options)
      if (address.uf) setValue('uf', address.uf, options)
      setFocus(address.street ? 'number' : 'street')
    },
    [setValue, setFocus],
  )

  const { status, lookup, reset } = useCepLookup(fillAddress)

  const cepField = register('cep', {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const masked = formatCep(event.target.value)
      setValue('cep', masked)
      if (isCompleteCep(masked)) {
        clearErrors('cep')
        void lookup(masked)
      } else {
        reset()
      }
    },
  })

  const cepError =
    errors.cep?.message ??
    (status === 'invalid' || status === 'not-found' || status === 'error' ? CEP_MESSAGES[status] : undefined)

  return (
    <Panel aria-labelledby="endereco-titulo">
      <PanelHeader>
        <MapPinLineIcon size={22} aria-hidden />
        <div>
          <h3 id="endereco-titulo">Endereço de Entrega</h3>
          <p>Informe o CEP: preenchemos rua, bairro, cidade e UF para você</p>
        </div>
      </PanelHeader>

      <Grid>
        <TextField
          className="cep"
          id="cep"
          label="CEP"
          placeholder="00000-000"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={9}
          error={cepError}
          aria-busy={status === 'loading'}
          adornment={status === 'loading' ? <CircleNotchIcon className="spinner" size={18} aria-hidden /> : null}
          {...cepField}
        />
        {status === 'loading' && (
          <CepStatus $error={false} role="status">
            {CEP_MESSAGES.loading}
          </CepStatus>
        )}
        <TextField
          className="street"
          id="street"
          label="Rua"
          autoComplete="address-line1"
          error={errors.street?.message}
          {...register('street')}
        />
        <TextField
          className="number"
          id="number"
          label="Número"
          error={errors.number?.message}
          {...register('number')}
        />
        <TextField
          className="complement"
          id="complement"
          label="Complemento"
          optional
          autoComplete="address-line2"
          error={errors.complement?.message}
          {...register('complement')}
        />
        <TextField
          className="neighborhood"
          id="neighborhood"
          label="Bairro"
          error={errors.neighborhood?.message}
          {...register('neighborhood')}
        />
        <TextField
          className="city"
          id="city"
          label="Cidade"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <TextField
          className="uf"
          id="uf"
          label="UF"
          maxLength={2}
          autoComplete="address-level1"
          style={{ textTransform: 'uppercase' }}
          error={errors.uf?.message}
          {...register('uf')}
        />
      </Grid>
    </Panel>
  )
}
