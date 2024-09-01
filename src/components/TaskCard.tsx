import type { ActivityType } from '@/types'
import { cn } from '@/utils/cn'
import { calculateDday } from '@/utils/dateUtils'

type TaskCardProps = {
  task: ActivityType
}

export function TaskCard({ task }: TaskCardProps) {
  const dday = calculateDday(task.endAt, task.startAt)

  return (
    <div className="rounded-12px bg-white p-12px shadow-sm">
      <div className="mb-8px flex items-center gap-8px">
        <span
          className={cn('rounded-8px px-6px py-4px text-11px', {
            'bg-blue-100 text-blue-800': task.type === 'video',
            'bg-green-100 text-green-800': task.type === 'assignment',
          })}
        >
          {task.type === 'video' ? '영상' : '과제'}
        </span>
        <h3 className="flex-1 text-14px font-semibold text-gray-800">{task.title}</h3>
      </div>
      <p className="mb-4px text-12px text-gray-600">{task.courseTitle}</p>
      <div className="flex items-center justify-between">
        <span className="text-11px font-bold text-gray-500">{dday}</span>
        <span
          className={cn('rounded-8px px-6px py-4px text-11px', {
            'bg-green-100 text-green-800': task.hasSubmitted,
            'bg-yellow-100 text-yellow-800': !task.hasSubmitted && !task.startAt,
            'bg-red-100 text-red-800': !task.hasSubmitted && task.startAt,
          })}
        >
          {task.hasSubmitted ? '제출완료' : task.startAt !== '' ? '미제출' : '예정됨'}
        </span>
      </div>
    </div>
  )
}
