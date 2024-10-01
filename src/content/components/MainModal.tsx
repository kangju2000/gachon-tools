import { motion } from 'framer-motion'
import { useState } from 'react'
import { ToastBar, Toaster } from 'react-hot-toast'

import { BottomNavigation } from './BottomNavigation'
import { SettingsContent } from './setting'
import { TaskContent } from './task'

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
        <Toaster
          containerStyle={{ bottom: 100 }}
          toastOptions={{
            position: 'bottom-center',
            success: {
              duration: 3000,
              style: {
                backgroundColor: 'rgba(133, 239, 133, 0.5)',
                border: '1px solid rgba(133, 239, 133, 0.5)',
              },
            },
            error: {
              duration: 3000,
              style: {
                backgroundColor: 'rgba(239, 133, 133, 0.5)',
                border: '1px solid rgba(239, 133, 133, 0.5)',
              },
            },
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              height: '40px',
              width: '200px',
              maxWidth: '200px',
              overflow: 'hidden',
              borderRadius: '24px',
              fontSize: '11px',
              boxShadow: '0 0 100px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {t => (
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                animation: t.visible ? 'fadein 0.5s' : 'fadeout 1s',
              }}
            />
          )}
        </Toaster>
      </div>
    </motion.div>
  )
}
