import { format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

import type { ActivityType } from '@/types'
import { cn } from '@/utils/cn'

type TaskCardProps = {
  task: ActivityType
}

export function TaskCard({ task }: TaskCardProps) {
  const startAtDate = new Date(task.startAt)
  const endAtDate = new Date(task.endAt)
  const dDay = isValid(endAtDate) ? formatDistanceToNowStrict(endAtDate, { addSuffix: true, locale: ko }) : null

  const taskLink = `https://cyber.gachon.ac.kr/mod/${task.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${task.id}`

  return (
    <a href={taskLink} rel="noopener noreferrer" className="block">
      <div className="cursor-pointer rounded-12px bg-white p-12px shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex gap-4px">
          <span
            className={cn('mr-4px mt-1px h-fit shrink-0 rounded-8px px-6px py-2px text-11px', {
              'bg-lime-100 text-lime-800': task.type === 'video',
              'bg-blue-100 text-blue-800': task.type === 'assignment',
            })}
          >
            {task.type === 'video' ? '영상' : '과제'}
          </span>
          <h3 className="break-keep text-14px font-semibold text-gray-800">{task.title}</h3>
        </div>
        <div className="my-8px h-1px bg-gray-100" />
        <p className="text-12px text-gray-600">{task.courseTitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-11px font-bold text-gray-500">
            {dDay != null ? `${`~${format(endAtDate, 'yy.MM.dd HH:mm')} (${dDay} 마감)`}` : '마감일 미정'}
          </span>
          <span
            className={cn('rounded-8px px-6px py-2px text-11px', {
              'bg-green-100 text-green-800': task.hasSubmitted,
              'bg-red-100 text-red-800': !task.hasSubmitted,
              'bg-gray-100 text-gray-800': isValid(startAtDate) && task.id === '',
            })}
          >
            {task.hasSubmitted ? '제출완료' : isValid(startAtDate) && task.id !== '' ? '미제출' : '예정됨'}
          </span>
        </div>
      </div>
    </a>
  )
}
