import { differenceInDays, differenceInHours, isPast, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Bell,
  EyeOff,
  CheckSquare,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'

import { useShadowRoot } from '@/hooks/useShadowRoot'
import { useStorageStore } from '@/storage/useStorageStore'
import type { Activity } from '@/types'
import { cn } from '@/utils/cn'

const StatusBadge = ({ isExpired, hasSubmitted }: { isExpired: boolean; hasSubmitted: boolean }) => {
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
  const { updateData, settings, overrides, reminders, filterOptions } = useStorageStore()
  const shadowRoot = useShadowRoot()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement | null>(null)
  const CLOSE_EVENT = 'gt-close-context-menus'

  useEffect(() => {
    const closeOnMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', closeOnMouseDown)
    return () => document.removeEventListener('mousedown', closeOnMouseDown)
  }, [menuOpen])

  useEffect(() => {
    const onCloseAll = () => setMenuOpen(false)
    window.addEventListener(CLOSE_EVENT, onCloseAll as EventListener)
    return () => window.removeEventListener(CLOSE_EVENT, onCloseAll as EventListener)
  }, [])
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

  const modulePath = task.type === 'assignment' ? 'assign' : task.type === 'video' ? 'vod' : 'quiz'
  const taskLink = `${window.location.origin}/mod/${modulePath}/view.php?id=${task.id}`

  const onContextMenu: React.MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    // 다른 카드 메뉴 닫기 브로드캐스트
    window.dispatchEvent(new Event(CLOSE_EVENT))
    setMenuOpen(true)
    setMenuPos({ x: e.clientX, y: e.clientY })
  }

  const hideTask = async () => {
    await updateData('overrides', prev => ({
      ...prev,
      hiddenActivityIds: Array.from(new Set([...(prev.hiddenActivityIds ?? []), task.id])),
    }))
    setMenuOpen(false)
    toast.success('과제를 숨겼어요')
  }

  const markCompleted = async () => {
    await updateData('overrides', prev => ({
      ...prev,
      completedActivityIds: Array.from(new Set([...(prev.completedActivityIds ?? []), task.id])),
    }))
    setMenuOpen(false)
    toast.success('완료로 표시했어요')
  }

  const addReminder = async () => {
    await updateData('reminders', prev => ({
      ...prev,
      enabledActivityIds: Array.from(new Set([...(prev.enabledActivityIds ?? []), task.id])),
    }))
    setMenuOpen(false)
    const hours = settings.reminders?.hoursBefore?.join(', ') ?? ''
    const days = settings.reminders?.daysBefore?.join(', ') ?? ''
    toast.success(`리마인드 등록됨 (시:${hours} / 일:${days})`)
  }

  const removeReminder = async () => {
    await updateData('reminders', prev => ({
      ...prev,
      enabledActivityIds: (prev.enabledActivityIds ?? []).filter(id => id !== task.id),
    }))
    setMenuOpen(false)
    toast.success('리마인드 해제됨')
  }

  const unhideTask = async () => {
    await updateData('overrides', prev => ({
      ...prev,
      hiddenActivityIds: (prev.hiddenActivityIds ?? []).filter(id => id !== task.id),
    }))
    setMenuOpen(false)
    toast.success('숨김이 해제되었어요')
  }

  const unmarkCompleted = async () => {
    await updateData('overrides', prev => ({
      ...prev,
      completedActivityIds: (prev.completedActivityIds ?? []).filter(id => id !== task.id),
    }))
    setMenuOpen(false)
    toast.success('완료 표시가 해제되었어요')
  }

  const isHidden = overrides.hiddenActivityIds.includes(task.id)
  const isCompletedOverride = overrides.completedActivityIds.includes(task.id)
  const canToggleComplete = !(task.hasSubmitted && !isCompletedOverride)
  const isReminderOn = reminders.enabledActivityIds.includes(task.id)

  return (
    <div onContextMenu={onContextMenu} className="block">
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-12px border-l-4 bg-white shadow-sm transition-shadow duration-300 hover:bg-gray-50 hover:shadow-md',
          isExpired && !task.hasSubmitted
            ? 'border-l-red-500'
            : task.hasSubmitted
              ? 'border-l-emerald-500'
              : 'border-l-yellow-500',
        )}
        onClick={() => (window.location.href = taskLink)}
      >
        <div className={cn('p-12px', filterOptions.showHidden && isHidden ? 'bg-gray-200' : undefined)}>
          <div className="flex items-start">
            <span className="mr-8px mt-2px flex-shrink-0 text-gray-500">
              {task.type === 'video' ? (
                <Video size={16} />
              ) : task.type === 'assignment' ? (
                <FileText size={16} />
              ) : (
                <HelpCircle size={16} />
              )}
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
      {menuOpen &&
        shadowRoot &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 min-w-160px rounded-8px border border-gray-200 bg-white p-4 shadow-xl"
            style={{ left: menuPos.x, top: menuPos.y }}
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
          >
            {isHidden ? (
              <button
                className="flex w-full items-center gap-6px rounded px-8px py-6px text-left hover:bg-gray-100"
                onClick={unhideTask}
              >
                <EyeOff size={14} /> 숨김 해제
              </button>
            ) : (
              <button
                className="flex w-full items-center gap-6px rounded px-8px py-6px text-left hover:bg-gray-100"
                onClick={hideTask}
              >
                <EyeOff size={14} /> 숨기기
              </button>
            )}
            {isCompletedOverride ? (
              <button
                className={cn(
                  'flex w-full items-center gap-6px rounded px-8px py-6px text-left',
                  canToggleComplete ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50',
                )}
                onClick={canToggleComplete ? unmarkCompleted : undefined}
                disabled={!canToggleComplete}
              >
                <CheckSquare size={14} /> 완료 해제
              </button>
            ) : (
              <button
                className={cn(
                  'flex w-full items-center gap-6px rounded px-8px py-6px text-left',
                  canToggleComplete ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50',
                )}
                onClick={canToggleComplete ? markCompleted : undefined}
                disabled={!canToggleComplete}
              >
                <CheckSquare size={14} /> 완료로 표시
              </button>
            )}
            {isReminderOn ? (
              <button
                className="flex w-full items-center gap-6px rounded px-8px py-6px text-left hover:bg-gray-100"
                onClick={removeReminder}
              >
                <Bell size={14} /> 리마인드 해제
              </button>
            ) : (
              <button
                className="flex w-full items-center gap-6px rounded px-8px py-6px text-left hover:bg-gray-100"
                onClick={addReminder}
              >
                <Bell size={14} /> 리마인드 추가
              </button>
            )}
          </div>,
          shadowRoot.getElementById('gt-app') ?? (shadowRoot as unknown as Element),
        )}
    </div>
  )
}
