import { PropsWithChildren } from 'react'

import { useThemeContext } from './theme-context'

export function ContentWrapper({ children }: PropsWithChildren) {
  const { theme } = useThemeContext()

  return (
    <div id="gt-app" data-theme={theme} style={{ width: 0, height: 0 }}>
      {children}
    </div>
  )
}
