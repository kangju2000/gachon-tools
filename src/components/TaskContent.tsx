import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect, useRef, useState } from 'react'

import { AnimatedRefreshButton } from './AnimatedRefreshButton'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TabNavigation } from './TabNavigation'
import { TaskList } from './TaskList'
import { contentsData } from '@/data/dummyData'
import useFilteredActivityList from '@/hooks/useFilteredActivityList'
import useGetContents from '@/hooks/useGetContents'

const isDevelopment = process.env.NODE_ENV === 'development'

export function TaskContent() {
  const [taskTab, setTaskTab] = useState<'ongoing' | 'all'>('ongoing')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data, pos, isLoading, refetch } = useGetContents({ enabled: !isDevelopment })

  const contentData = isDevelopment ? contentsData : data

  const filteredTasks = useFilteredActivityList(contentData.activityList, '-1', taskTab === 'ongoing' ? 0 : 1, false)

  const formattedUpdateTime = formatDistanceToNow(new Date(contentData.updateAt), { addSuffix: true, locale: ko })

  useEffect(() => {
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
  }, [taskTab])

  return (
    <>
      <div className="h-90px bg-white bg-opacity-50 px-16px py-12px">
        <div className="mb-12px flex items-center justify-between">
          <h2 className="text-16px font-bold">과제 목록</h2>
          <div className="group relative">
            <AnimatedRefreshButton onClick={refetch} />
            <div className="absolute right-0 mt-4px whitespace-nowrap rounded-2px bg-gray-800 px-6px py-2px text-10px text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              {formattedUpdateTime} 갱신됨
            </div>
          </div>
        </div>
        <TabNavigation activeTab={taskTab} setActiveTab={setTaskTab} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 h-16px bg-gradient-to-b from-slate-100 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-16px bg-gradient-to-t from-slate-100 to-transparent"></div>
        <div ref={scrollRef} className="h-full overflow-y-auto px-16px py-20px">
          {isLoading ? <LoadingSkeleton progress={pos} /> : <TaskList tasks={filteredTasks} />}
        </div>
      </div>
    </>
  )
}
