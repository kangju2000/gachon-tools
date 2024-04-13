import createCache from '@emotion/cache'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import root from 'react-shadow/emotion'

type Props = {
  children: React.ReactNode
}

export function ShadowRootWrapper({ children }: Props) {
  const shadowRef = useRef<HTMLElement>(null)

  const [emotionCache, setEmotionCache] = useState<EmotionCache | null>(null)

  useEffect(() => {
    if (!shadowRef.current?.shadowRoot) return

    const cache = createCache({
      key: 'shadow',
      container: shadowRef.current.shadowRoot,
    })

    setEmotionCache(cache)
  }, [])

  return (
    <root.div ref={shadowRef}>
      <CacheProvider value={emotionCache}>{emotionCache ? children : null}</CacheProvider>
    </root.div>
  )
}
