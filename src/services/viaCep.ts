import { onlyDigits } from '../utils/cep'

export interface CepAddress {
  cep: string
  street: string
  neighborhood: string
  city: string
  uf: string
}

export type CepLookupResult =
  | { status: 'success'; address: CepAddress }
  | { status: 'invalid' }
  | { status: 'not-found' }
  | { status: 'error' }

interface ViaCepResponse {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean | string
}

export const VIACEP_URL = 'https://viacep.com.br/ws'

/**
 * Consulta o ViaCEP (RF-08 / RN-07). Nunca lança erro: falhas viram status.
 * Erros de cancelamento (AbortError) são propagados para quem chamou ignorar.
 */
export async function fetchAddressByCep(cep: string, signal?: AbortSignal): Promise<CepLookupResult> {
  const digits = onlyDigits(cep)
  if (digits.length !== 8) return { status: 'invalid' }

  let response: Response
  try {
    response = await fetch(`${VIACEP_URL}/${digits}/json/`, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    return { status: 'error' }
  }

  if (response.status === 400) return { status: 'invalid' }
  if (!response.ok) return { status: 'error' }

  let data: ViaCepResponse
  try {
    data = (await response.json()) as ViaCepResponse
  } catch {
    return { status: 'error' }
  }

  // ViaCEP responde 200 com { erro: true } (ou "true") para CEP inexistente.
  if (data.erro) return { status: 'not-found' }

  return {
    status: 'success',
    address: {
      cep: data.cep ?? digits,
      street: data.logradouro ?? '',
      neighborhood: data.bairro ?? '',
      city: data.localidade ?? '',
      uf: data.uf ?? '',
    },
  }
}
