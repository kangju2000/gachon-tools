import { formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useMemo } from 'react'

import CourseList from './CourseList'
import { RefreshIcon, SettingIcon } from './Icons'
import PopoverOptions from './PopoverOptions'
import TabContent from './TabContent'
import useGetContents from '@/hooks/useGetContents'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
  const [selectedCourseId, setSelectedCourseId] = useState('-1')
  const {
    data: { courseList, activityList, updateAt },
    pos,
    refetch,
    isLoading,
  } = useGetContents({ enabled: isOpen })

  const loadingText = useMemo(() => {
    if (isLoading) {
      return '불러오는 중...'
    }

    const updateAtDate = new Date(updateAt)
    if (!isValid(updateAtDate)) {
      return '업데이트 날짜 없음'
    }

    const time = formatDistanceToNowStrict(updateAtDate, { addSuffix: true, locale: ko })
    return `${time} 업데이트`
  }, [isLoading, updateAt])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative h-[500px] w-[90%] overflow-hidden rounded-8px bg-white md:w-[750px] dark:bg-gray-800"
          >
            <div className="flex min-h-[60px] items-center border-b border-gray-200 px-24px dark:border-gray-700">
              <h2 className="text-18px font-bold">Gachon Tools</h2>
              <button
                className="absolute right-16px top-16px text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            <div className="flex h-[calc(100%-110px)] overflow-hidden">
              <div className="hidden h-full w-[200px] overflow-y-auto px-18px py-24px md:block">
                <CourseList
                  courseList={courseList}
                  selectedCourseId={selectedCourseId}
                  setSelectedCourseId={setSelectedCourseId}
                />
              </div>
              <div className="hidden w-[1px] bg-gray-200 md:block dark:bg-gray-700" />
              <div className="h-full flex-1 overflow-y-auto px-24px">
                <TabContent
                  activityList={activityList}
                  selectedCourseId={selectedCourseId}
                  pos={pos}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <div className="flex h-[50px] items-center border-t border-gray-200 px-24px dark:border-gray-700">
              <PopoverOptions
                triggerElement={
                  <button className="flex cursor-pointer items-center bg-transparent p-6px">
                    <SettingIcon className="mr-4px text-gray-600 dark:text-gray-400" />
                    <span className="text-12px font-medium text-gray-600 dark:text-gray-400">설정</span>
                  </button>
                }
              />
              <div className="flex-1" />
              <div className="flex cursor-pointer items-center" onClick={refetch}>
                <span className="mr-4px text-12px text-gray-600 dark:text-gray-400">{loadingText}</span>
                <RefreshIcon className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ContentModal
