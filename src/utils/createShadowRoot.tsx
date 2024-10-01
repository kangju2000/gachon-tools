import { createRoot } from 'react-dom/client'

import { SHADOW_ID } from '@/constants'

export default function createShadowRoot(styles: string[], options: { root?: HTMLElement } = {}) {
  const isDev = import.meta.env.MODE === 'development'
  const root = options.root || document.createElement('div')
  root.setAttribute('id', SHADOW_ID)
  const shadowRoot = root.attachShadow({ mode: 'open' })

  const globalStyleSheet = new CSSStyleSheet()
  globalStyleSheet.replaceSync(styles.join('\n'))

  shadowRoot.adoptedStyleSheets = [globalStyleSheet]

  if (isDev) {
    const styleElement = document.querySelector('style[data-vite-dev-id]')

    if (styleElement) {
      shadowRoot.appendChild(styleElement)
    }
  }

  document.body.appendChild(root)

  return createRoot(shadowRoot)
}
