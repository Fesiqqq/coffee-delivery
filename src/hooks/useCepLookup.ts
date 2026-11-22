import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchAddressByCep, type CepAddress } from '../services/viaCep'

export type CepStatus = 'idle' | 'loading' | 'success' | 'invalid' | 'not-found' | 'error'

export const CEP_MESSAGES: Record<Exclude<CepStatus, 'idle' | 'success'>, string> = {
  loading: 'Buscando endereço…',
  invalid: 'CEP inválido. Confira os 8 dígitos.',
  'not-found': 'CEP não encontrado. Confira o número ou preencha o endereço manualmente.',
  error: 'Não foi possível consultar o CEP agora. Tente novamente ou preencha o endereço manualmente.',
}

/**
 * Controla a consulta de CEP: estado de carregamento, erros e cancelamento
 * da requisição anterior quando o usuário digita outro CEP.
 */
export function useCepLookup(onSuccess: (address: CepAddress) => void) {
  const [status, setStatus] = useState<CepStatus>('idle')
  const controllerRef = useRef<AbortController | null>(null)
  const onSuccessRef = useRef(onSuccess)

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const lookup = useCallback(async (cep: string) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('loading')

    try {
      const result = await fetchAddressByCep(cep, controller.signal)
      if (controller.signal.aborted) return
      if (result.status === 'success') onSuccessRef.current(result.address)
      setStatus(result.status)
    } catch {
      // Requisição cancelada: uma nova consulta já está em andamento.
    }
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    setStatus('idle')
  }, [])

  return { status, lookup, reset }
}
