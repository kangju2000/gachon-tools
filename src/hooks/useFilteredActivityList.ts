import type { ActivityType } from '@/types'
import type { ActivityKind, ActivityStatus, SortBy, SortOrder } from '@/types/storage'

interface FilterOptions {
  sortBy: SortBy
  sortOrder: SortOrder
  status: ActivityStatus
  kind: ActivityKind
  courseId?: string
  searchQuery?: string
}

const isOngoing = (activity: ActivityType, now: Date): boolean =>
  new Date(activity.startAt) <= now && now <= new Date(activity.endAt)

const isCompleted = (activity: ActivityType, now: Date): boolean =>
  activity.hasSubmitted || new Date(activity.endAt) < now

const isUpcoming = (activity: ActivityType, now: Date): boolean => new Date(activity.startAt) > now

const filterByStatus = (activity: ActivityType, status: ActivityStatus, now: Date): boolean => {
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

const filterByKind = (activity: ActivityType, kind: ActivityKind): boolean => kind === 'all' || activity.type === kind

const filterByCourse = (activity: ActivityType, courseId?: string): boolean =>
  !courseId || activity.courseId === courseId

const filterBySearchQuery = (activity: ActivityType, searchQuery?: string): boolean => {
  if (!searchQuery) return true
  const query = searchQuery.toLowerCase()
  return activity.title.toLowerCase().includes(query) || activity.courseTitle.toLowerCase().includes(query)
}

const sortActivities = (a: ActivityType, b: ActivityType, sortBy: SortBy, sortOrder: SortOrder): number => {
  const aDate = new Date(a[sortBy])
  const bDate = new Date(b[sortBy])

  return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
}

export function filterAndSortActivities(activities: ActivityType[], options: FilterOptions): ActivityType[] {
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
