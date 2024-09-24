import { cn } from '@/utils/cn'

type NavigationProps = {
  activeTab: 'tasks' | 'settings'
  setActiveTab: (tab: 'tasks' | 'settings') => void
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <div className="flex justify-around border-t border-gray-200 bg-white bg-opacity-80">
      <button
        className={cn('flex flex-1 flex-col items-center justify-center px-16px py-12px', {
          'text-blue-500': activeTab === 'tasks',
          'text-gray-500': activeTab !== 'tasks',
        })}
        onClick={() => setActiveTab('tasks')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4px h-24px w-24px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-12px">과제</span>
      </button>
      <button
        className={cn('flex flex-1 flex-col items-center justify-center px-16px py-12px', {
          'text-blue-500': activeTab === 'settings',
          'text-gray-500': activeTab !== 'settings',
        })}
        onClick={() => setActiveTab('settings')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4px h-24px w-24px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-12px">설정</span>
      </button>
    </div>
  )
}
