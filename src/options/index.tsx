import { Options } from './Options'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

const root = createShadowRoot([styles])

root.render(
  <ContentThemeProvider>
    <Options />
  </ContentThemeProvider>,
)
