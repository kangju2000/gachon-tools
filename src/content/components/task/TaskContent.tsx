import { formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, RefreshCw, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { LoadingSkeleton } from './LoadingSkeleton'
import { TaskList } from './TaskList'
import { useContentsFetcher } from '@/hooks/useContentsFetcher'
import { filterAndSortActivities } from '@/hooks/useFilteredActivityList'
import { useStorageStore } from '@/storage/useStorageStore'
import type { ActivityStatus, SortBy, SortOrder } from '@/types/storage'

export function TaskContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { progress, isLoading, refetch } = useContentsFetcher()
  const { meta, contents, filterOptions, updateFilterOptions } = useStorageStore()

  const filteredTasks = filterAndSortActivities(contents.activityList, {
    ...filterOptions,
    searchQuery,
  })

  const formattedUpdateTime = formatDistanceToNowStrict(new Date(meta.updateAt), { addSuffix: true, locale: ko })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filteredTasks])

  const statusMap = {
    ongoing: '진행중',
    upcoming: '예정',
    completed: '완료',
    all: '전체',
  }

  const sortByMap = {
    endAt: '마감일',
    startAt: '시작일',
    title: '제목',
  }

  const getFilterSummary = () => {
    const parts = []
    if (filterOptions.status !== 'all') parts.push(statusMap[filterOptions.status])
    parts.push(`${sortByMap[filterOptions.sortBy]} ${filterOptions.sortOrder === 'asc' ? '오름차순' : '내림차순'}`)
    return parts.join(' · ')
  }

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
          <span>{getFilterSummary()}</span>
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
                <div className="grid grid-cols-2 gap-8px">
                  <div>
                    <label className="mb-2px block text-11px font-medium text-gray-600">상태</label>
                    <select
                      className="d-select d-select-bordered d-select-sm w-full"
                      value={filterOptions.status}
                      onChange={e => updateFilterOptions({ status: e.target.value as ActivityStatus })}
                    >
                      <option value="ongoing">진행중</option>
                      <option value="upcoming">예정</option>
                      <option value="completed">완료</option>
                      <option value="all">전체</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2px block text-11px font-medium text-gray-600">정렬 기준</label>
                    <select
                      className="d-select d-select-bordered d-select-sm w-full"
                      value={filterOptions.sortBy}
                      onChange={e => updateFilterOptions({ sortBy: e.target.value as SortBy })}
                    >
                      <option value="endAt">마감일</option>
                      <option value="startAt">시작일</option>
                      <option value="title">제목</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2px block text-11px font-medium text-gray-600">정렬 순서</label>
                  <select
                    className="d-select d-select-bordered d-select-sm w-full"
                    value={filterOptions.sortOrder}
                    onChange={e => updateFilterOptions({ sortOrder: e.target.value as SortOrder })}
                  >
                    <option value="asc">오름차순</option>
                    <option value="desc">내림차순</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 h-16px bg-gradient-to-b from-slate-100 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-16px bg-gradient-to-t from-slate-100 to-transparent"></div>
        <div ref={scrollRef} className="no-scrollbar h-full overflow-y-auto overscroll-contain px-16px py-20px">
          {isLoading ? <LoadingSkeleton progress={progress} /> : <TaskList tasks={filteredTasks} />}
        </div>
      </div>
    </>
  )
}
