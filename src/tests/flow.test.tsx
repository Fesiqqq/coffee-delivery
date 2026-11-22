import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../utils/storage-keys'
import { renderApp } from './renderApp'

function mockViaCep(body: unknown, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(body, { status }))
}

const paulista = {
  cep: '01310-100',
  logradouro: 'Avenida Paulista',
  bairro: 'Bela Vista',
  localidade: 'São Paulo',
  uf: 'SP',
}

describe('fluxo de compra (RF-01 a RF-13)', () => {
  it('exibe o catálogo com imagem, nome, descrição, preço e tags (RF-01)', async () => {
    await renderApp('/')
    const card = screen.getByRole('article', { name: 'Expresso Tradicional' })
    expect(within(card).getByRole('img')).toHaveAttribute('alt', expect.stringContaining('Expresso Tradicional'))
    expect(within(card).getByText(/água quente/)).toBeInTheDocument()
    expect(within(card).getByLabelText('Preço: R$ 9,90')).toBeInTheDocument()
    expect(within(card).getByText('tradicional')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(14)
  })

  it('acumula quantidades, soma unidades no badge e persiste (RF-02..RF-06)', async () => {
    const { user, unmount } = await renderApp('/')
    const latte = screen.getByRole('article', { name: 'Latte' })

    await user.click(within(latte).getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(within(latte).getByRole('button', { name: 'Adicionar 2 Latte ao carrinho' }))
    await user.click(within(latte).getByRole('button', { name: 'Adicionar 1 Latte ao carrinho' }))

    const expresso = screen.getByRole('article', { name: 'Expresso Tradicional' })
    await user.click(within(expresso).getByRole('button', { name: /Adicionar 1/ }))

    expect(screen.getByRole('link', { name: 'Carrinho com 4 itens' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!)).toEqual({
      items: [
        { coffeeId: 'latte', quantity: 3 },
        { coffeeId: 'expresso-tradicional', quantity: 1 },
      ],
    })

    // "Refresh": desmonta e monta de novo lendo o localStorage.
    unmount()
    const again = await renderApp('/checkout')
    expect(screen.getAllByRole('listitem').filter((li) => within(li).queryByText('Latte'))).toHaveLength(1)
    expect(screen.getByTestId('subtotal')).toHaveTextContent('R$ 45,60') // 3×11,90 + 9,90
    expect(screen.getByTestId('delivery')).toHaveTextContent('R$ 3,50')
    expect(screen.getByTestId('total')).toHaveTextContent('R$ 49,10')

    // RF-05: incrementa, decrementa (trava em 1) e remove.
    expect(screen.getByRole('button', { name: 'Diminuir quantidade de Expresso Tradicional' })).toBeDisabled()
    await again.user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Expresso Tradicional' }))
    expect(screen.getByTestId('subtotal')).toHaveTextContent('R$ 55,50')
    await again.user.click(screen.getByRole('button', { name: 'Remover Latte do carrinho' }))
    expect(screen.getByTestId('total')).toHaveTextContent('R$ 23,30')
    expect(screen.getByRole('link', { name: 'Carrinho com 2 itens' })).toBeInTheDocument()
  })

  it('bloqueia confirmação com carrinho vazio (RF-11, RN-09)', async () => {
    await renderApp('/checkout')
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled()
    expect(screen.getByTestId('total')).toHaveTextContent('R$ 0,00')
  })

  it('valida o formulário e anuncia os erros (RF-09, RF-11)', async () => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items: [{ coffeeId: 'latte', quantity: 1 }] }))
    const { user } = await renderApp('/checkout')

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('campos precisam de atenção')
    expect(screen.getByLabelText('CEP')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('CEP')).toHaveFocus()
    expect(screen.getByText('Selecione uma forma de pagamento')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEYS.lastOrder)).toBe('null')
  })

  it('mostra erro de CEP não encontrado e mantém campos editáveis (RF-08)', async () => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items: [{ coffeeId: 'latte', quantity: 1 }] }))
    mockViaCep({ erro: true })
    const { user } = await renderApp('/checkout')

    await user.type(screen.getByLabelText('CEP'), '99999999')
    expect(await screen.findByText(/CEP não encontrado/)).toBeInTheDocument()
    expect(screen.getByLabelText('Rua')).toBeEnabled()
  })

  it('preenche endereço pelo CEP, confirma, mostra snapshot e limpa o carrinho (RF-08, RF-12, RF-13)', async () => {
    localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify({ items: [{ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'arabe', quantity: 1 }] }),
    )
    const fetchSpy = mockViaCep(paulista)
    const { user, unmount } = await renderApp('/checkout')

    await user.type(screen.getByLabelText('CEP'), '01310100')
    await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Paulista'))
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText('Bairro')).toHaveValue('Bela Vista')
    expect(screen.getByLabelText('Cidade')).toHaveValue('São Paulo')
    expect(screen.getByLabelText('UF')).toHaveValue('SP')
    expect(screen.getByLabelText('Número')).toHaveFocus()
    expect(screen.getByLabelText('Número')).toHaveValue('')

    await user.type(screen.getByLabelText('Número'), '1000')
    await user.type(screen.getByLabelText(/Complemento/), 'Apto 42')
    await user.click(screen.getByRole('radio', { name: 'Dinheiro' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('heading', { name: 'Uhu! Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('Avenida Paulista, 1000 – Apto 42')).toBeInTheDocument()
    expect(screen.getByText('Dinheiro')).toBeInTheDocument()
    expect(screen.getByText('R$ 41,20')).toBeInTheDocument() // 2×11,90 + 13,90 + 3,50
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!)).toEqual({ items: [] })

    // Após refresh, o sucesso continua correto mesmo com o carrinho vazio.
    unmount()
    await renderApp('/success')
    expect(screen.getByText('Avenida Paulista, 1000 – Apto 42')).toBeInTheDocument()
    expect(screen.getByText('2× Latte')).toBeInTheDocument()
  })

  it('mostra estado vazio em /success sem pedido (RN-09)', async () => {
    await renderApp('/success')
    expect(screen.getByRole('heading', { name: 'Nenhum pedido encontrado' })).toBeInTheDocument()
  })
})
