import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { SettingsContent } from './setting'
import { Navigation } from '@/content/components/Navigation'
import { TaskContent } from '@/content/components/task'
import { cn } from '@/utils/cn'

export function Trigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'settings'>('tasks')

  useHotkeys('ctrl+/, meta+/', () => {
    setIsOpen(prev => !prev)
  })

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(prev => !prev)}
        className={cn('d-mask d-mask-squircle fixed bottom-25px right-25px z-[9999] h-56px w-56px cursor-pointer', {
          'bg-blue-500': isOpen,
          'bg-blue-400': !isOpen,
        })}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-96px right-25px h-600px w-350px overflow-hidden rounded-36px border border-solid border-slate-200 border-opacity-50 bg-slate-100 shadow-[0_0_100px_0_rgba(0,0,0,0.2)]"
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
