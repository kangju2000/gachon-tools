import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

// remove scroll to top button
document.getElementById('back-top')?.remove()

const root = createShadowRoot(styles)

root.render(
  <ContentThemeProvider>
    <Trigger />
  </ContentThemeProvider>,
)
