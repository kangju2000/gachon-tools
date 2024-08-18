import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export function Trigger() {
  const [isOpen, setIsOpen] = useState(false)

  useHotkeys('ctrl+/, meta+/', () => {
    setIsOpen(prev => !prev)
  })

  return (
    <>
      <label className="d-swap">
        <input type="checkbox" onChange={() => setIsOpen(prev => !prev)} checked={isOpen} />
        <div className="d-mask d-swap-off d-mask-squircle fixed bottom-25px right-25px z-[9999] h-56px w-56px cursor-pointer bg-black"></div>
        <div className="d-mask d-swap-on d-mask-squircle fixed bottom-25px right-25px z-[9999] h-56px w-56px cursor-pointer bg-white"></div>
      </label>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-96px right-25px h-600px w-350px rounded-36px bg-base-200"
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
