import { useState } from 'react'

import { Navigation } from './Navigation'
import { SettingsContent } from './SettingsContent'
import { TaskContent } from './TaskContent'

export function Content() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'settings'>('tasks')

  return (
    <div className="flex h-full flex-col">
      {activeTab === 'tasks' ? <TaskContent /> : <SettingsContent />}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
