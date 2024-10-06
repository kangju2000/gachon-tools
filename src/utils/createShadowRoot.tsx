import { SHADOW_HOST_ID } from '@/constants'

export default function createShadowRoot(styles: string[]): ShadowRoot {
  const host = document.createElement('div')
  host.setAttribute('id', SHADOW_HOST_ID)
  const shadowRoot = host.attachShadow({ mode: 'open' })

  const globalStyleSheet = new CSSStyleSheet()
  globalStyleSheet.replaceSync(styles.join('\n'))

  shadowRoot.adoptedStyleSheets = [globalStyleSheet]

  document.body.appendChild(host)

  return shadowRoot
}
