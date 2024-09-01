import { differenceInDays } from 'date-fns'

export function calculateDday(endDate: string, startDate: string): string {
  if (!endDate) return '마감일 미정'

  const today = new Date()
  const start = startDate ? new Date(startDate) : null
  const end = new Date(endDate)

  if (start && start > today) {
    return `${differenceInDays(start, today)}일 후 시작`
  }

  const daysLeft = differenceInDays(end, today)
  if (isNaN(daysLeft)) return '날짜 없음'
  if (daysLeft < 0) return '마감'
  if (daysLeft === 0) return 'D-Day'

  return `D-${daysLeft}`
}
