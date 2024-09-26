import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { MainModal } from './MainModal'
import { useStorageStore } from '@/storage/useStorageStore'

export function Trigger() {
  const [isOpen, setIsOpen] = useState(false)

  const { settings, status } = useStorageStore()

  useHotkeys('ctrl+/, meta+/', () => {
    setIsOpen(prev => !prev)
  })

  if (status === 'initializing') {
    return null
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="d-mask d-mask-squircle fixed bottom-25px right-25px h-56px w-56px cursor-pointer bg-cover bg-center bg-no-repeat shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
        style={
          settings.trigger.type === 'color'
            ? { background: settings.trigger.color }
            : { backgroundImage: `url(${settings.trigger.image})` }
        }
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <X size={24} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{isOpen && <MainModal />}</AnimatePresence>
    </>
  )
}
