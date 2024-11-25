import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { MainModal } from './MainModal'
import { useShadowRoot } from '@/hooks/useShadowRoot'
import { useShortcutStore } from '@/storage/useShortcutStore'
import { useStorageStore } from '@/storage/useStorageStore'
import type { StorageData } from '@/types'

const isActiveElementEditable = (element: Element | null): boolean => {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
}

const TriggerButton = ({
  isOpen,
  onClick,
  settings,
}: {
  isOpen: boolean
  onClick: () => void
  settings: StorageData['settings']
}) => (
  <div
    onClick={onClick}
    className="d-mask d-mask-squircle fixed bottom-25px right-25px h-56px w-56px cursor-pointer bg-cover bg-center bg-no-repeat shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
    style={
      settings.trigger.type === 'color'
        ? { background: settings.trigger.color }
        : { backgroundImage: `url(${settings.trigger.image})` }
    }
  >
    <AnimatePresence>{isOpen && <CloseOverlay />}</AnimatePresence>
  </div>
)

const CloseOverlay = () => (
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
)

export function Trigger() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, isInitialized } = useStorageStore()
  const { isEditing } = useShortcutStore()
  const shadowRoot = useShadowRoot()

  const toggleOpen = () => setIsOpen(prev => !prev)

  const handleHotkey = () => {
    const activeElement = shadowRoot?.activeElement
    if (isEditing || isActiveElementEditable(activeElement ?? null)) {
      return
    }

    toggleOpen()
  }

  useHotkeys(settings.shortcut, handleHotkey, [isEditing, shadowRoot])

  if (!isInitialized) return null

  return (
    <>
      <TriggerButton isOpen={isOpen} onClick={toggleOpen} settings={settings} />
      <AnimatePresence>{isOpen && <MainModal />}</AnimatePresence>
    </>
  )
}
