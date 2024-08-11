import { AnimatePresence, motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

// import ContentModal from '@/components/ContentModal'

export default function Trigger() {
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])

  useHotkeys('ctrl+/, meta+/', () => {
    setIsOpen(prev => !prev)
  })

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ width: '100px', height: '50px', x: -30 }}
            className="fixed bottom-25px left-1/2 z-[9999] h-10 w-10 cursor-pointer rounded-full bg-primary shadow-2xl"
            onClick={onOpen}
          />
        )}
      </AnimatePresence>

      <ContentModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
