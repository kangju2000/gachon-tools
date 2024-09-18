import { useState, type PropsWithChildren } from 'react'

import { ThemeContext } from '../context'

import type { Theme } from 'daisyui'

export function ContentThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div id="gt-app" data-theme={theme}>
        <div id="gt-content">{children}</div>
      </div>
    </ThemeContext.Provider>
  )
}
