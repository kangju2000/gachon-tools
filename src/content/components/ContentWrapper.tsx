import { useThemeContext } from './theme-context'

import type { PropsWithChildren } from 'react'

export function ContentWrapper({ children }: PropsWithChildren) {
  const { theme } = useThemeContext()

  return (
    <div id="gt-app" data-theme={theme}>
      {children}
    </div>
  )
}
