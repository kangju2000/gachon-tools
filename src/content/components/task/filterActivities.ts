import { isValid } from 'date-fns'

import type { Activity, Course } from '@/types'
import type { ActivityStatus, FilterOptions as _FilterOptions } from '@/types/storage'

interface FilterOptions extends _FilterOptions {
  searchQuery?: string
}

const isOngoing = (activity: Activity, now: Date): boolean =>
  new Date(activity.startAt) <= now && now <= new Date(activity.endAt)
const isCompleted = (activity: Activity): boolean => activity.hasSubmitted

const isValidActivity = (activity: Activity): boolean =>
  activity.id.trim() !== '' && isValid(new Date(activity.startAt)) && isValid(new Date(activity.endAt))

const filterByStatus = (activity: Activity, status: ActivityStatus, now: Date): boolean => {
  switch (status) {
    case 'ongoing':
      return isOngoing(activity, now)
    case 'completed':
      return isCompleted(activity)
    case 'all':
      return true
  }
}

const filterByCourse = (activity: Activity, courseId?: string): boolean => !courseId || activity.courseId === courseId

const filterBySearchQuery = (activity: Activity, searchQuery?: string): boolean => {
  if (!searchQuery) return true
  const query = searchQuery.toLowerCase()
  return activity.title.toLowerCase().includes(query) || activity.courseTitle.toLowerCase().includes(query)
}

export function filterActivities(activities: Activity[], options: FilterOptions): Activity[] {
  const now = new Date()

  return activities.filter(
    activity =>
      isValidActivity(activity) &&
      filterByStatus(activity, options.status, now) &&
      filterByCourse(activity, options.courseId) &&
      filterBySearchQuery(activity, options.searchQuery),
  )
}

export function getAvailableCourses(activities: Activity[]): Course[] {
  const courseSet = new Set<string>()
  activities.forEach(activity => courseSet.add(activity.courseId))
  return Array.from(courseSet).map(id => ({ id, title: activities.find(a => a.courseId === id)?.courseTitle || '' }))
}
