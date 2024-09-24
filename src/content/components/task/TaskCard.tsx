import { differenceInDays, differenceInHours, isPast, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Video, FileText, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react'

import type { Activity } from '@/types'
import { cn } from '@/utils/cn'

const StatusBadge = ({ isExpired, hasSubmitted }) => {
  if (isExpired && !hasSubmitted) {
    return (
      <span className="flex items-center text-12px text-red-600">
        <XCircle size={14} className="mr-1" /> 미제출
      </span>
    )
  }
  if (hasSubmitted) {
    return (
      <span className="flex items-center text-12px text-emerald-600">
        <CheckCircle size={14} className="mr-1" /> 제출 완료
      </span>
    )
  }
  return (
    <span className="flex items-center text-12px text-yellow-600">
      <AlertTriangle size={14} className="mr-1" /> 제출 필요
    </span>
  )
}

type Props = {
  task: Activity
}

export function TaskCard({ task }: Props) {
  const endAtDate = new Date(task.endAt)
  const now = new Date()
  const daysUntilDue = differenceInDays(endAtDate, now)
  const isExpired = isPast(endAtDate)

  const getDeadlineText = () => {
    if (isExpired) return '마감됨'
    if (daysUntilDue === 0) {
      const hoursLeft = differenceInHours(endAtDate, now)
      return hoursLeft <= 1 ? '1시간 이내' : `${hoursLeft}시간 후`
    }
    if (daysUntilDue === 1) return '내일'
    if (daysUntilDue <= 7) return `${daysUntilDue}일 후`
    return '7일 이상'
  }

  const getExactDeadline = () => format(endAtDate, 'M월 d일(E) HH:mm', { locale: ko })

  const taskLink = `https://cyber.gachon.ac.kr/mod/${task.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${task.id}`

  return (
    <a href={taskLink} rel="noopener noreferrer" className="block">
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-12px border-l-4 bg-white shadow-sm transition-shadow duration-300 hover:bg-gray-50 hover:shadow-md',
          isExpired && !task.hasSubmitted
            ? 'border-l-red-500'
            : task.hasSubmitted
              ? 'border-l-emerald-500'
              : 'border-l-yellow-500',
        )}
      >
        <div className="p-12px">
          <div className="flex items-start">
            <span className="mr-8px mt-2px flex-shrink-0 text-gray-500">
              {task.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
            </span>
            <div className="flex flex-1 flex-col">
              <h3 className="mb-2px flex-1 break-keep text-14px font-semibold text-gray-700">{task.title}</h3>
              <span className="text-11px text-gray-500">{task.courseTitle}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4px bg-gray-50 px-12px py-8px">
          <span
            className={cn(
              'd-tooltip d-tooltip-right flex cursor-help items-center text-12px font-medium',
              isExpired ? 'text-gray-500' : 'text-gray-700',
            )}
            data-tip={getExactDeadline()}
          >
            <Clock size={14} className="mr-1 inline-block" />
            {getDeadlineText()}
          </span>
          <StatusBadge isExpired={isExpired} hasSubmitted={task.hasSubmitted} />
        </div>
      </div>
    </a>
  )
}
