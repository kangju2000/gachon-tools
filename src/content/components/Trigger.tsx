import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { SettingsContent } from './setting'
import { Navigation } from '@/content/components/Navigation'
import { TaskContent } from '@/content/components/task'
import { useStorageStore } from '@/storage/useStorageStore'
import { cn } from '@/utils/cn'

export function Trigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'settings'>('tasks')

  const { settings, status } = useStorageStore()

  useHotkeys('ctrl+/, meta+/', () => {
    setIsOpen(prev => !prev)
  })

  if (status === 'initializing') {
    return null
  }

  const iconVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      pathLength: 0,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      scale: 1,
      pathLength: 1,
      transition: {
        opacity: { delay: 0.2, duration: 0.2 },
        scale: { delay: 0.2, duration: 0.2 },
        pathLength: { delay: 0.2, duration: 0.3 },
      },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'd-mask d-mask-squircle fixed bottom-25px right-25px h-56px w-56px cursor-pointer bg-cover bg-center bg-no-repeat shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl',
        )}
        style={{ backgroundImage: `url(${settings.triggerImage})` }}
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
              <motion.div
                animate={isOpen ? 'open' : 'closed'}
                variants={iconVariants}
                className="absolute inset-0 flex items-center justify-center text-white"
              >
                <X size={24} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-96px right-25px h-600px w-350px overflow-hidden rounded-36px border border-solid border-slate-200 border-opacity-50 bg-slate-100 shadow-[0_0_100px_0_rgba(0,0,0,0.2)] backdrop-blur-sm"
          >
            <div className="flex h-full flex-col">
              {activeTab === 'tasks' ? <TaskContent /> : <SettingsContent />}
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
