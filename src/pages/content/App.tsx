import { ThemeProvider, theme, CSSReset, Box } from '@chakra-ui/react'
import createCache from '@emotion/cache'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import root from 'react-shadow/emotion'

import Trigger from '@/components/Trigger'

const ShadowContext = createContext<React.RefObject<HTMLElement>>(null)

export const useShadowContext = () => {
  return useContext(ShadowContext)
}

export default function App() {
  const shadowRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const [emotionCache, setEmotionCache] = useState<EmotionCache | null>(null)

  useEffect(() => {
    if (!shadowRoot) return

    const cache = createCache({
      key: 'shadow',
      container: shadowRoot,
    })

    setEmotionCache(cache)
  }, [shadowRoot])

  useEffect(() => {
    if (!shadowRef.current.shadowRoot) return

    setShadowRoot(shadowRef.current.shadowRoot)
  }, [shadowRef.current?.shadowRoot])

  return (
    <root.div ref={shadowRef}>
      <CacheProvider value={emotionCache}>
        <div id="shadow-root" ref={rootRef}>
          {emotionCache && (
            <ThemeProvider cssVarsRoot=":host,:root" theme={theme}>
              <CSSReset />
              <ShadowContext.Provider value={rootRef}>
                <Box pos="fixed" w="100vw" display="flex" bottom="25px" justifyContent="center" zIndex="9999">
                  <Trigger />
                </Box>
              </ShadowContext.Provider>
            </ThemeProvider>
          )}
        </div>
      </CacheProvider>
    </root.div>
  )
}
