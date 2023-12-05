import { useDisclosure } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import ContentModal from '@/components/ContentModal'
import PositionButton from '@/components/PositionButton'

export default function App() {
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
        {!isOpen && <PositionButton onClick={onOpen} />}
      </AnimatePresence>
      <ContentModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
