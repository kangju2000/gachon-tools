import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import ActivityList from './ActivityList'
import LoadingProgress from './LoadingProgress'
import { TAB_LIST } from '@/constants'
import useFilteredActivityList from '@/hooks/useFilteredActivityList'
import type { ActivityType } from '@/types'

type Props = {
  activityList: ActivityType[]
  selectedCourseId: string
  pos: number
  isLoading: boolean
}

const TabContent = ({ activityList, selectedCourseId, pos, isLoading }: Props) => {
  const [tabIndex, setTabIndex] = useState(0)
  const filteredActivities = useFilteredActivityList(activityList, selectedCourseId, tabIndex, false)

  return (
    <div>
      <div className="sticky top-0 z-10 flex bg-white pt-16px dark:bg-gray-800">
        {TAB_LIST.map((tab, index) => (
          <button
            key={tab}
            className={`relative px-4 py-2 text-14px transition-colors duration-200 ${
              tabIndex === index
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400'
            }`}
            onClick={() => setTabIndex(index)}
          >
            {tab}
            {tabIndex === index && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 dark:bg-blue-400"
                layoutId="underline"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tabIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? <LoadingProgress pos={pos} /> : <ActivityList contentData={filteredActivities} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TabContent
