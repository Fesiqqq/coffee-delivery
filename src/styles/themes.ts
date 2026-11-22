/**
 * Tokens de design (RF-14). Os dois temas têm exatamente a mesma forma,
 * garantida pelo tipo `AppTheme`; componentes só usam nomes semânticos.
 */

const base = {
  fonts: {
    title: "'Baloo 2', 'Trebuchet MS', system-ui, sans-serif",
    text: "'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  radii: { sm: '6px', md: '8px', lg: '12px', card: '6px 36px 6px 36px', pill: '999px' },
  breakpoints: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
  layout: { maxWidth: '1160px', gutter: 'clamp(1rem, 4vw, 2rem)', headerHeight: '72px' },
}

export interface ThemeColors {
  background: string
  surface: string
  surfaceAlt: string
  input: string
  border: string
  title: string
  text: string
  textMuted: string
  brand: string
  brandStrong: string
  brandSoft: string
  onBrandStrong: string
  onBrand: string
  accent: string
  accentStrong: string
  accentSoft: string
  onAccent: string
  danger: string
  dangerSoft: string
  success: string
  focus: string
  shadow: string
}

export interface AppTheme {
  mode: 'light' | 'dark'
  colors: ThemeColors
  fonts: typeof base.fonts
  radii: typeof base.radii
  breakpoints: typeof base.breakpoints
  layout: typeof base.layout
}

/** Paleta do Style Guide do Figma (amarelo + roxo) com contraste revisado para AA. */
export const lightTheme: AppTheme = {
  ...base,
  mode: 'light',
  colors: {
    background: '#FAFAFA',
    surface: '#F3F2F2',
    surfaceAlt: '#EDEDED',
    input: '#EEEDED',
    border: '#D7D5D5',
    title: '#272221',
    text: '#403937',
    textMuted: '#574F4D',
    brand: '#DBAC2C',
    brandStrong: '#8A5A0C', // texto amarelo-escuro (6.0:1 sobre background)
    brandSoft: '#F1E9C9',
    onBrandStrong: '#FFFFFF',
    onBrand: '#272221',
    accent: '#8047F8',
    accentStrong: '#4B2995',
    accentSoft: '#EBE5F9',
    onAccent: '#FFFFFF',
    danger: '#B3261E',
    dangerSoft: '#FCE8E6',
    success: '#2E7D32',
    focus: '#8047F8',
    shadow: 'rgba(39, 34, 33, 0.08)',
  },
}

/** Noite de Lua: fundo roxo-quase-preto, superfícies elevadas mais claras. */
export const darkTheme: AppTheme = {
  ...base,
  mode: 'dark',
  colors: {
    background: '#151219',
    surface: '#221D29',
    surfaceAlt: '#2C2635',
    input: '#1B1720',
    border: '#3D3548',
    title: '#F3F2F2',
    text: '#DDD8E2',
    textMuted: '#B3ABBD',
    brand: '#F1C24A',
    brandStrong: '#F1C24A',
    brandSoft: '#3A3020',
    onBrandStrong: '#1B1720',
    onBrand: '#1B1720',
    accent: '#B49BFF',
    accentStrong: '#C4B0FF',
    accentSoft: '#2F2645',
    onAccent: '#151219',
    danger: '#FF8A80',
    dangerSoft: '#3D1F22',
    success: '#81C784',
    focus: '#F1C24A',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
}

export const themes = { light: lightTheme, dark: darkTheme } as const
export type ThemeMode = keyof typeof themes
