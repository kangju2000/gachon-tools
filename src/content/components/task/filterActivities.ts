import { isValid } from 'date-fns'

import type { Activity } from '@/types'
import type { ActivityStatus, FilterOptions as _FilterOptions } from '@/types/storage'

interface FilterOptions extends _FilterOptions {
  searchQuery?: string
}

const isOngoing = (activity: Activity): boolean => new Date() <= new Date(activity.endAt)

const isValidActivity = (activity: Activity): boolean => activity.id !== '' && isValid(new Date(activity.endAt))

const filterByStatus = (activity: Activity, status: ActivityStatus): boolean => {
  switch (status) {
    case 'ongoing':
      return isOngoing(activity)
    case 'unsubmitted':
      return !activity.hasSubmitted && isOngoing(activity)
    case 'all':
    default:
      return true
  }
}

const filterByCourse = (activity: Activity, selectedCourseIds: string[]): boolean => {
  if (!selectedCourseIds?.length) return true
  if (selectedCourseIds.includes('-1')) return true
  return selectedCourseIds.includes(activity.courseId)
}

const filterBySearchQuery = (activity: Activity, searchQuery?: string): boolean => {
  if (!searchQuery) return true
  const query = searchQuery.toLowerCase()
  return activity.title.toLowerCase().includes(query) || activity.courseTitle.toLowerCase().includes(query)
}

export function filterActivities(activity: Activity, options: FilterOptions): boolean {
  return (
    isValidActivity(activity) &&
    filterByStatus(activity, options.status) &&
    filterByCourse(activity, options.selectedCourseIds) &&
    filterBySearchQuery(activity, options.searchQuery)
  )
}
