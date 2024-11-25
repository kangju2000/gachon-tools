import { createContext, useContext } from 'react'

import type { Theme } from 'daisyui'

type ThemeContextValue<T = Theme> = {
  theme: T
  setTheme: (theme: T) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }

  return context
}
