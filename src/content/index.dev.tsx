import { createRoot } from 'react-dom/client'

import '@/styles/index.css'
import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'

// remove scroll to top button
document.getElementById('back-top')?.remove()

const container = document.createElement('div')

const styleElement = document.querySelector('style[data-vite-dev-id]')

if (!styleElement) {
  throw new Error('Style element with attribute data-vite-dev-id not found.')
}

const shadowRoot = container.attachShadow({ mode: 'open' })
shadowRoot.appendChild(styleElement)

document.body.appendChild(container)

const root = createRoot(shadowRoot)
root.render(
  <ContentThemeProvider>
    <Trigger />
  </ContentThemeProvider>,
)
