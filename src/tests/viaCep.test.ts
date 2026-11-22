import { describe, expect, it, vi } from 'vitest'
import { VIACEP_URL, fetchAddressByCep } from '../services/viaCep'

function mockFetch(impl: () => Promise<Response>) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(impl)
}

describe('fetchAddressByCep (RF-08)', () => {
  it('mapeia a resposta do ViaCEP', async () => {
    const spy = mockFetch(async () =>
      Response.json({ cep: '01310-100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP' }),
    )
    const result = await fetchAddressByCep('01310-100')
    expect(spy).toHaveBeenCalledWith(`${VIACEP_URL}/01310100/json/`, expect.anything())
    expect(result).toEqual({
      status: 'success',
      address: { cep: '01310-100', street: 'Avenida Paulista', neighborhood: 'Bela Vista', city: 'São Paulo', uf: 'SP' },
    })
  })

  it('não consulta CEP incompleto', async () => {
    const spy = mockFetch(async () => Response.json({}))
    expect(await fetchAddressByCep('0131')).toEqual({ status: 'invalid' })
    expect(spy).not.toHaveBeenCalled()
  })

  it('trata CEP inexistente ({ erro: true })', async () => {
    mockFetch(async () => Response.json({ erro: 'true' }))
    expect(await fetchAddressByCep('99999-999')).toEqual({ status: 'not-found' })
  })

  it('trata HTTP 400 como CEP inválido', async () => {
    mockFetch(async () => new Response('Bad Request', { status: 400 }))
    expect(await fetchAddressByCep('00000-000')).toEqual({ status: 'invalid' })
  })

  it('trata indisponibilidade da API', async () => {
    mockFetch(async () => new Response('', { status: 503 }))
    expect(await fetchAddressByCep('01310-100')).toEqual({ status: 'error' })
  })

  it('trata falha de rede', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    expect(await fetchAddressByCep('01310-100')).toEqual({ status: 'error' })
  })

  it('propaga cancelamento para o chamador ignorar', async () => {
    mockFetch(async () => {
      throw new DOMException('aborted', 'AbortError')
    })
    await expect(fetchAddressByCep('01310-100')).rejects.toThrow('aborted')
  })
})
