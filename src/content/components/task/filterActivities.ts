import { isValid } from 'date-fns'

import type { Activity } from '@/types'
import type { ActivityStatus, FilterOptions as _FilterOptions } from '@/types/storage'

interface FilterOptions extends _FilterOptions {
  searchQuery?: string
}

const isOngoing = (activity: Activity): boolean => {
  const now = new Date()
  return new Date(activity.startAt) <= now && now <= new Date(activity.endAt)
}

const isValidActivity = (activity: Activity): boolean => activity.id !== '' && isValid(new Date(activity.endAt))

const filterByStatus = (activity: Activity, status: ActivityStatus): boolean => {
  if (status === 'ongoing') {
    return isOngoing(activity)
  }

  return true
}

const filterByCourse = (activity: Activity, courseId: string): boolean =>
  courseId === '-1' || activity.courseId === courseId

const filterBySearchQuery = (activity: Activity, searchQuery?: string): boolean => {
  if (!searchQuery) return true
  const query = searchQuery.toLowerCase()
  return activity.title.toLowerCase().includes(query) || activity.courseTitle.toLowerCase().includes(query)
}

export function filterActivities(activity: Activity, options: FilterOptions): boolean {
  return (
    isValidActivity(activity) &&
    filterByStatus(activity, options.status) &&
    filterByCourse(activity, options.courseId) &&
    filterBySearchQuery(activity, options.searchQuery)
  )
}
