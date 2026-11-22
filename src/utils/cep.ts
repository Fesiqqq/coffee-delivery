export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** "01310100" → "01310-100" (aplica a máscara enquanto o usuário digita). */
export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function isCompleteCep(value: string): boolean {
  return onlyDigits(value).length === 8
}

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const
