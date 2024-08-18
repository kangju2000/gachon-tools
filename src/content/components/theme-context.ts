import { Theme } from 'daisyui'
import { createContext, useContext } from 'react'

type ThemeContextValue<T = Theme> = {
  theme: T
  setTheme: (theme: T) => void
}

export const ThemeContext = createContext<ThemeContextValue>(null)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }

  return context
}
