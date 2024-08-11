import { ChakraProvider } from '@chakra-ui/react'
import { createContext, useContext, useRef } from 'react'

import { ShadowRootWrapper } from './ShadowRootWrapper'
import { customTheme } from '@/constants/customTheme'

type Props = {
  children: React.ReactNode
}

export function ShadowChakraProvider({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  return (
    // <ShadowRootWrapper>
    <ChakraProvider cssVarsRoot=":host,:root" theme={customTheme}>
      <div ref={rootRef}>
        <RootRefContext.Provider value={rootRef}>{children}</RootRefContext.Provider>
      </div>
    </ChakraProvider>
    // </ShadowRootWrapper>
  )
}

const RootRefContext = createContext<React.RefObject<HTMLElement>>(null)

export const useRootRefContext = () => {
  return useContext(RootRefContext)
}
