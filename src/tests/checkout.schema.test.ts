import { describe, expect, it } from 'vitest'
import { checkoutSchema } from '../schemas/checkout'

const valid = {
  cep: '01310-100',
  street: 'Avenida Paulista',
  number: '1000',
  complement: '',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  uf: 'sp',
  paymentMethod: 'credit',
}

function errorsOf(data: Record<string, unknown>) {
  const result = checkoutSchema.safeParse(data)
  if (result.success) return {}
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message
  return errors
}

describe('checkoutSchema (RN-07)', () => {
  it('aceita um endereço válido e normaliza a UF', () => {
    const result = checkoutSchema.parse(valid)
    expect(result.uf).toBe('SP')
  })

  it('complemento é opcional', () => {
    expect(checkoutSchema.safeParse({ ...valid, complement: undefined }).success).toBe(true)
  })

  it('exige CEP com 8 dígitos', () => {
    expect(errorsOf({ ...valid, cep: '0131' }).cep).toMatch(/CEP inválido/)
    expect(errorsOf({ ...valid, cep: '' }).cep).toBe('Informe o CEP')
  })

  it('exige campos obrigatórios (espaços não contam)', () => {
    const errors = errorsOf({ ...valid, street: '   ', number: '', neighborhood: '', city: '' })
    expect(Object.keys(errors).sort()).toEqual(['city', 'neighborhood', 'number', 'street'])
  })

  it('rejeita UF inexistente', () => {
    expect(errorsOf({ ...valid, uf: 'XX' }).uf).toBe('UF inválida')
  })

  it('exige forma de pagamento válida (RF-09)', () => {
    expect(errorsOf({ ...valid, paymentMethod: null }).paymentMethod).toBe('Selecione uma forma de pagamento')
    expect(errorsOf({ ...valid, paymentMethod: 'pix' }).paymentMethod).toBe('Selecione uma forma de pagamento')
  })
})
