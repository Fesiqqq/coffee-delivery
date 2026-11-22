import styled from 'styled-components'
import symbolDark from '../assets/brand/logo-symbol-dark.svg'
import symbolLight from '../assets/brand/logo-symbol-light.svg'
import { useTheme } from '../hooks/useTheme'

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.title};
    white-space: nowrap;

    em {
      font-style: normal;
      color: ${({ theme }) => theme.colors.accentStrong};
    }
  }
`

/** Logo criada com IA (RF-16): símbolo com variação para fundo claro/escuro + nome. */
export function Logo() {
  const { mode } = useTheme()
  return (
    <Wrapper>
      <img src={mode === 'dark' ? symbolDark : symbolLight} alt="" />
      <span>
        Café <em>Lua</em>
      </span>
    </Wrapper>
  )
}
