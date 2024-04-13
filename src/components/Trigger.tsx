import { useDisclosure } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import ChakraMotion from '@/components/ChakraMotion'
import ContentModal from '@/components/ContentModal'

export default function Trigger() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  useHotkeys('ctrl+/, meta+/', () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  })

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen && (
          <ChakraMotion
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ width: '100px', height: '50px', x: -30 }}
            position="fixed"
            bottom="25px"
            left="50%"
            w="40px"
            h="40px"
            bg="#2F6EA2"
            boxShadow="dark-lg"
            rounded="full"
            cursor="pointer"
            zIndex={9999}
            onClick={onOpen}
          />
        )}
      </AnimatePresence>

      <ContentModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
