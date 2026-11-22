const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const plain = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 1090 → "R$ 10,90" (RN-04). Usa espaço comum no lugar do NBSP para facilitar testes e leitores de tela. */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, ' ')
}

/** 1090 → "10,90" (sem símbolo, para o preço destacado do card). */
export function formatAmount(cents: number): string {
  return plain.format(cents / 100)
}
