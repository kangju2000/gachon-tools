import { createRoot } from 'react-dom/client'

export default function createShadowRoot(styles: string) {
  const root = document.createElement('div')
  const shadow = root.attachShadow({ mode: 'open' })

  const globalStyleSheet = new CSSStyleSheet()
  globalStyleSheet.replaceSync(styles)

  shadow.adoptedStyleSheets = [globalStyleSheet]

  document.body.appendChild(root)

  return createRoot(shadow)
}
