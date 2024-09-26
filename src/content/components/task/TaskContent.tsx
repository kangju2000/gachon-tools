import { formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, RefreshCw, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { LoadingSkeleton } from './LoadingSkeleton'
import { TaskList } from './TaskList'
import { useContentsFetcher } from '@/hooks/useContentsFetcher'
import { useStorageStore } from '@/storage/useStorageStore'
import type { ActivityStatus } from '@/types/storage'
import { cn } from '@/utils/cn'

const statusMap: Record<ActivityStatus, string> = {
  ongoing: '진행 중인 과제',
  all: '전체 과제',
}

export function TaskContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { progress, isLoading, refetch } = useContentsFetcher()
  const { meta, contents, filterOptions, getFilteredActivities, updateData } = useStorageStore()

  const filteredTasks = getFilteredActivities(searchQuery)
  const formattedUpdateTime = formatDistanceToNowStrict(new Date(meta.updateAt), { addSuffix: true, locale: ko })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filterOptions])

  return (
    <>
      <div className="bg-white bg-opacity-50 px-16px py-12px">
        <div className="mb-12px flex items-center justify-between">
          <h2 className="text-16px font-bold">과제 목록</h2>
          <div className="group relative">
            <button className="d-btn d-btn-ghost d-btn-sm p-1" onClick={refetch} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <div className="absolute right-0 z-10 mt-4px whitespace-nowrap rounded-2px bg-gray-800 px-6px py-2px text-10px text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              {isLoading ? '갱신 중...' : `${formattedUpdateTime} 갱신됨`}
            </div>
          </div>
        </div>

        <div className="relative mb-8px">
          <input
            type="text"
            placeholder="과제 검색"
            className="d-input d-input-sm d-input-bordered w-full pl-36px"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-12px top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center justify-between text-12px text-gray-500">
          <div className="flex flex-wrap items-center gap-4px">
            <span className="flex items-center rounded-full bg-blue-100 px-8px py-2px text-11px text-blue-700">
              {statusMap[filterOptions.status]}
            </span>

            <span className="flex items-center rounded-full bg-blue-100 px-8px py-2px text-11px text-blue-700">
              {contents.courseList.find(course => course.id === filterOptions.courseId)?.title || '전체 과목'}
            </span>
          </div>

          <button
            className="d-btn d-btn-ghost d-btn-sm flex items-center p-1"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label={isFilterOpen ? '필터 닫기' : '필터 열기'}
          >
            <Filter size={16} />
            <motion.div initial={false} animate={{ rotate: isFilterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-8px space-y-8px rounded-lg border border-gray-200 bg-white p-8px shadow-sm">
                <div>
                  <label className="mb-2px block text-11px font-medium text-gray-600">상태</label>
                  <div className="flex gap-4px">
                    {Object.entries(statusMap).map(([key, value]) => (
                      <button
                        key={key}
                        className={cn('rounded-full px-8px py-2px text-11px', {
                          'bg-blue-100 text-blue-700': filterOptions.status === key,
                          'bg-gray-100 text-gray-700 hover:bg-gray-200': filterOptions.status !== key,
                        })}
                        onClick={() =>
                          updateData('filterOptions', prev => ({ ...prev, status: key as ActivityStatus }))
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2px block text-11px font-medium text-gray-600">과목</label>
                  <div className="flex flex-wrap gap-4px">
                    {contents.courseList.map(course => (
                      <button
                        key={course.id}
                        className={cn('rounded-full px-8px py-2px text-11px', {
                          'bg-blue-100 text-blue-700': filterOptions.courseId === course.id,
                          'bg-gray-100 text-gray-700 hover:bg-gray-300': filterOptions.courseId !== course.id,
                        })}
                        onClick={() => updateData('filterOptions', prev => ({ ...prev, courseId: course.id }))}
                      >
                        {course.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 h-16px bg-gradient-to-b from-slate-100 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-16px bg-gradient-to-t from-slate-100 to-transparent"></div>
        <div
          ref={scrollRef}
          className={cn('no-scrollbar h-full overscroll-contain px-16px py-20px', {
            'overflow-y-scroll': !isLoading,
            'overflow-hidden': isLoading,
          })}
        >
          {isLoading ? <LoadingSkeleton progress={progress} /> : <TaskList tasks={filteredTasks} />}
        </div>
      </div>
    </>
  )
}
