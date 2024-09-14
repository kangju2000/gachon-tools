import { format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

import type { ActivityType } from '@/types'
import { cn } from '@/utils/cn'

type TaskCardProps = {
  task: ActivityType
}

export function TaskCard({ task }: TaskCardProps) {
  const endAtDate = new Date(task.endAt)
  const dDay = isValid(endAtDate) ? formatDistanceToNowStrict(endAtDate, { addSuffix: true, locale: ko }) : '기한 없음'

  const taskLink = `https://cyber.gachon.ac.kr/mod/${task.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${task.id}`

  return (
    <a href={taskLink} rel="noopener noreferrer" className="block">
      <div className="cursor-pointer rounded-12px bg-white p-12px shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="mb-4px flex items-center gap-4px">
          <span
            className={cn('rounded-8px px-6px py-2px text-11px', {
              'bg-gray-100 text-gray-800': task.type === 'video',
              'bg-blue-100 text-blue-800': task.type === 'assignment',
            })}
          >
            {task.type === 'video' ? '영상' : '과제'}
          </span>
          <h3 className="flex-1 text-14px font-semibold text-gray-800">{task.title}</h3>
        </div>
        <p className="text-12px text-gray-600">{task.courseTitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-11px font-bold text-gray-500">
            {dDay === '기한 없음'
              ? dDay
              : `${isValid(endAtDate) && `~${format(endAtDate, 'yy.MM.dd HH:mm')} (${dDay})`}`}
          </span>
          <span
            className={cn('rounded-8px px-6px py-2px text-11px', {
              'bg-green-100 text-green-800': task.hasSubmitted,
              'bg-yellow-100 text-yellow-800': !task.hasSubmitted && !task.startAt,
              'bg-red-100 text-red-800': !task.hasSubmitted && task.startAt,
            })}
          >
            {task.hasSubmitted ? '제출완료' : task.startAt !== '' ? '미제출' : '예정됨'}
          </span>
        </div>
      </div>
    </a>
  )
}
