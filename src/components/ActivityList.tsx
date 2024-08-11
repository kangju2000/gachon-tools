import { format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { motion } from 'framer-motion'

import { CheckIcon, XMarkIcon } from './Icons'
import type { ActivityType } from '@/types'

type ActivityListProps = {
  contentData: ActivityType[]
}

export const ActivityList = ({ contentData }: ActivityListProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-16px">
      {contentData.length > 0 ? (
        contentData.map(activity => <ActivityItem key={activity.id} activity={activity} />)
      ) : (
        <p className="text-14px text-center text-gray-500">진행중인 과제가 없습니다.</p>
      )}
    </motion.div>
  )
}

type ActivityItemProps = {
  activity: ActivityType
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const endAtDate = new Date(activity.endAt)
  const dDay = isValid(endAtDate) ? formatDistanceToNowStrict(endAtDate, { addSuffix: true, locale: ko }) : '기한 없음'

  return (
    <a
      href={`https://cyber.gachon.ac.kr/mod/${activity.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${
        activity.id
      }`}
      className="block min-h-72px rounded-8px bg-white p-16px shadow-sm transition-colors duration-200 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="flex items-center justify-between gap-10px">
        <div className="flex items-center gap-10px">
          {activity.hasSubmitted ? <CheckIcon className="flex-shrink-0" /> : <XMarkIcon className="flex-shrink-0" />}
          <div>
            <div className="flex items-center gap-4px">
              <ActivityBadge type={activity.type} />
              <h3 className="text-14px truncate font-semibold">{activity.title}</h3>
            </div>
            <p className="text-12px truncate text-gray-500 dark:text-gray-400">{activity.courseTitle}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-14px truncate">
            <span className="text-12px font-normal">마감</span> {dDay}
          </p>
          <p className="text-12px truncate text-gray-500 dark:text-gray-400">
            {isValid(endAtDate) && `~${format(endAtDate, 'yyyy.MM.dd HH:mm')}`}
          </p>
        </div>
      </div>
    </a>
  )
}

const ActivityBadge = ({ type }: { type: ActivityType['type'] }) => {
  const badge = {
    assignment: { color: 'bg-blue-500', text: '과제' },
    video: { color: 'bg-gray-500', text: '영상' },
  }[type]

  return <span className={`${badge.color} text-9px rounded-4px px-4px py-2px font-bold text-white`}>{badge.text}</span>
}

export default ActivityList
