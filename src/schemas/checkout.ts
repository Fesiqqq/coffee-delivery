import { z } from 'zod'
import { UFS, onlyDigits } from '../utils/cep'

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `Informe ${label}`).max(max, `Máximo de ${max} caracteres`)

/** Validação do checkout (RF-08, RF-09, RN-07). */
export const checkoutSchema = z.object({
  cep: z
    .string()
    .trim()
    .min(1, 'Informe o CEP')
    .refine((value) => onlyDigits(value).length === 8, 'CEP inválido. Use o formato 00000-000'),
  street: requiredText('a rua'),
  number: z
    .string()
    .trim()
    .min(1, 'Informe o número (ou S/N)')
    .max(10, 'Máximo de 10 caracteres'),
  complement: z.string().trim().max(60, 'Máximo de 60 caracteres').optional(),
  neighborhood: requiredText('o bairro'),
  city: requiredText('a cidade'),
  uf: z
    .string()
    .trim()
    .min(1, 'Informe a UF')
    .transform((value) => value.toUpperCase())
    .refine((value) => (UFS as readonly string[]).includes(value), 'UF inválida'),
  paymentMethod: z.enum(['credit', 'debit', 'cash'], { error: 'Selecione uma forma de pagamento' }),
})

/** Valores digitados no formulário (antes das transformações). */
export type CheckoutFormInput = z.input<typeof checkoutSchema>
/** Valores validados e normalizados. */
export type CheckoutFormData = z.output<typeof checkoutSchema>
