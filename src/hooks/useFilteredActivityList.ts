import type { Activity } from '@/types'
import type { ActivityKind, ActivityStatus, SortBy, SortOrder } from '@/types/storage'

interface FilterOptions {
  sortBy: SortBy
  sortOrder: SortOrder
  status: ActivityStatus
  kind: ActivityKind
  courseId?: string
  searchQuery?: string
}

const isOngoing = (activity: Activity, now: Date): boolean =>
  new Date(activity.startAt) <= now && now <= new Date(activity.endAt)
const isCompleted = (activity: Activity, now: Date): boolean => activity.hasSubmitted || new Date(activity.endAt) < now
const isUpcoming = (activity: Activity, now: Date): boolean => new Date(activity.startAt) > now

const filterByStatus = (activity: Activity, status: ActivityStatus, now: Date): boolean => {
  switch (status) {
    case 'ongoing':
      return isOngoing(activity, now)
    case 'completed':
      return isCompleted(activity, now)
    case 'upcoming':
      return isUpcoming(activity, now)
    case 'all':
      return true
  }
}

const filterByKind = (activity: Activity, kind: ActivityKind): boolean => kind === 'all' || activity.type === kind

const filterByCourse = (activity: Activity, courseId?: string): boolean => !courseId || activity.courseId === courseId

const filterBySearchQuery = (activity: Activity, searchQuery?: string): boolean => {
  if (!searchQuery) return true
  const query = searchQuery.toLowerCase()
  return activity.title.toLowerCase().includes(query) || activity.courseTitle.toLowerCase().includes(query)
}

const sortActivities = (a: Activity, b: Activity, sortBy: SortBy, sortOrder: SortOrder): number => {
  const aDate = new Date(a[sortBy])
  const bDate = new Date(b[sortBy])

  return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
}

export function filterAndSortActivities(activities: Activity[], options: FilterOptions): Activity[] {
  const now = new Date()

  return activities
    .filter(
      activity =>
        filterByStatus(activity, options.status, now) &&
        filterByKind(activity, options.kind) &&
        filterByCourse(activity, options.courseId) &&
        filterBySearchQuery(activity, options.searchQuery),
    )
    .sort((a, b) => sortActivities(a, b, options.sortBy, options.sortOrder))
}
