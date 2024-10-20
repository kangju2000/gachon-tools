import { motion } from 'framer-motion'
import { useState } from 'react'

import { BottomNavigation } from './BottomNavigation'
import { SettingsContent } from './setting'
import { TaskContent } from './task'
import { ToastContainer } from './ToastContainer'

import type { Variants } from 'framer-motion'

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { type: 'spring', stiffness: 150, damping: 18, mass: 0.5 },
  },
}

export function MainModal() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'settings'>('tasks')

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-96px right-25px h-600px w-350px origin-bottom-right overflow-hidden rounded-36px bg-slate-100 shadow-[0_0_100px_0_rgba(0,0,0,0.2)] backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        {activeTab === 'tasks' ? <TaskContent /> : <SettingsContent />}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <ToastContainer />
      </div>
    </motion.div>
  )
}
