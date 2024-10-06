import { createRoot } from 'react-dom/client'
import cropperStyles from 'react-easy-crop/react-easy-crop.css?inline'

import { App } from './App'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

function initApp() {
  // remove scroll to top button
  document.getElementById('back-top')?.remove()

  const shadowRoot = createShadowRoot([styles, cropperStyles])
  createRoot(shadowRoot).render(<App />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
