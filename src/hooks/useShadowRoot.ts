import { useEffect, useState } from 'react'

import { SHADOW_HOST_ID } from '@/constants'

export function useShadowRoot(): ShadowRoot | null {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)

  useEffect(() => {
    const hostElement = document.querySelector(`#${SHADOW_HOST_ID}`)
    if (hostElement && hostElement.shadowRoot) {
      setShadowRoot(hostElement.shadowRoot)
    }
  }, [])

  return shadowRoot
}
