import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

import { ShadowChakraProvider, useRootRefContext } from '@/components/ShadowChakraProvider'
import Trigger from '@/components/Trigger'

export default function App() {
  return (
    <ShadowChakraProvider>
      <Trigger />
      <ColorSetting />
    </ShadowChakraProvider>
  )
}

const ColorSetting = () => {
  const { colorMode } = useColorMode()
  const rootRef = useRootRefContext()

  useEffect(() => {
    const root = rootRef.current

    root.dataset.theme = colorMode
    root.style.colorScheme = colorMode
  }, [colorMode])

  return null
}
