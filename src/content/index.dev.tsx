import cropperStyles from 'react-easy-crop/react-easy-crop.css?inline'

import '@/styles/index.css'

import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'
import createShadowRoot from '@/utils/createShadowRoot'

// remove scroll to top button
document.getElementById('back-top')?.remove()

const root = createShadowRoot([cropperStyles])

root.render(
  <ContentThemeProvider>
    <Trigger />
  </ContentThemeProvider>,
)
