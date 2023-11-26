import { ChakraProvider } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

import Popup from '@/pages/popup/Popup'

createRoot(document.getElementById('app-container') as HTMLElement).render(
  <ChakraProvider>
    <Popup />
  </ChakraProvider>,
)
