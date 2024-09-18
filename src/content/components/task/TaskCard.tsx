import { format, differenceInDays, differenceInHours } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Video, FileText, CheckCircle } from 'lucide-react'

import type { Activity } from '@/types'
import { cn } from '@/utils/cn'

type TaskCardProps = {
  task: Activity
}

export function TaskCard({ task }: TaskCardProps) {
  const endAtDate = new Date(task.endAt)
  const now = new Date()
  const daysUntilDue = differenceInDays(endAtDate, now)

  const getDeadlineText = () => {
    if (daysUntilDue < 0) return <span className="font-bold">마감됨</span>
    if (daysUntilDue === 0)
      return (
        <>
          <span className="font-bold">{differenceInHours(endAtDate, now)}시간 후</span>
          <span className="text-12px"> 마감</span>
        </>
      )
    if (daysUntilDue === 1)
      return (
        <>
          <span className="font-bold">내일</span>
          <span className="text-12px"> 마감</span>
        </>
      )
    return (
      <>
        <span className="font-bold">{daysUntilDue}일 후</span>
        <span className="text-12px"> 마감</span>
      </>
    )
  }

  const getExactDeadline = () => {
    return format(endAtDate, 'M월 d일 HH:mm', { locale: ko })
  }

  const taskLink = `https://cyber.gachon.ac.kr/mod/${task.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${task.id}`

  return (
    <a href={taskLink} rel="noopener noreferrer" className="block">
      <div className="relative cursor-pointer rounded-12px border border-transparent bg-white p-12px shadow-sm transition-shadow duration-300 hover:border hover:border-gray-200 hover:bg-gray-50 hover:shadow-md">
        <div className="mb-4px flex items-start">
          <span className="mr-8px mt-2px text-gray-500">
            {task.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
          </span>
          <div className="flex flex-1 items-start">
            <h3 className="flex-1 break-keep text-14px font-semibold text-gray-700">{task.title}</h3>
            <CheckCircle
              size={16}
              className={cn('ml-4px mt-2px flex-shrink-0', {
                'text-emerald-500': task.hasSubmitted,
                'text-rose-400': !task.hasSubmitted,
              })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-11px text-gray-500">{task.courseTitle}</span>
            <span className="text-10px text-gray-400">{getExactDeadline()}</span>
          </div>
          <span className="text-13px text-gray-600">{getDeadlineText()}</span>
        </div>
      </div>
    </a>
  )
}
