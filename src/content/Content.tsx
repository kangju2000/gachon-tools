import { Theme } from 'daisyui'
import { useState } from 'react'

import { ContentWrapper } from './components/ContentWrapper'
import { ThemeContext } from './components/theme-context'
import { Trigger } from '@/components/Trigger'

export default function Content() {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme }}>
      <ContentWrapper>
        <Trigger />
      </ContentWrapper>
    </ThemeContext.Provider>
  )
}
