import { cn } from '@/utils/cn'

type TabNavigationProps = {
  activeTab: 'ongoing' | 'all'
  setActiveTab: (tab: 'ongoing' | 'all') => void
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex space-x-8px">
      <button
        className={cn('rounded-full px-10px py-4px text-12px transition-colors', {
          'bg-blue-500 text-white': activeTab === 'ongoing',
          'bg-gray-200 text-gray-700': activeTab !== 'ongoing',
        })}
        onClick={() => setActiveTab('ongoing')}
      >
        진행중
      </button>
      <button
        className={cn('rounded-full px-10px py-4px text-12px transition-colors', {
          'bg-blue-500 text-white': activeTab === 'all',
          'bg-gray-200 text-gray-700': activeTab !== 'all',
        })}
        onClick={() => setActiveTab('all')}
      >
        전체
      </button>
    </div>
  )
}
