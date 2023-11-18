import { Box, useDisclosure } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import ChakraMotion from '@/components/ChakraMotion'
import ContentModal from '@/components/ContentModal'

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys('ctrl+k, meta+k', () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  })

  return (
    <Box pos="fixed" w="100vw" display="flex" bottom="25px" justifyContent="center" zIndex="9999">
      <AnimatePresence>
        {!isOpen && (
          <ChakraMotion
            initial={{ width: '0px', height: '0px' }}
            animate={{ width: '40px', height: '40px' }}
            exit={{ width: '0px', height: '0px' }}
            whileHover={{ width: '100px', height: '50px' }}
            w="40px"
            h="40px"
            bg="#2F6EA2"
            boxShadow="dark-lg"
            rounded="full"
            cursor="pointer"
            onClick={onOpen}
          />
        )}
      </AnimatePresence>
      <ContentModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
