import Popup from './Popup'
import { ContentWrapper } from '@/content/components/ContentWrapper'
import { ThemeContext } from '@/content/components/theme-context'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

const root = createShadowRoot(styles)

root.render(
  <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
    <ContentWrapper>
      <Popup />
    </ContentWrapper>
  </ThemeContext.Provider>,
)
