import type { Contents } from '.'

export type StorageData = {
  meta: {
    version: string
    updateAt: string
  }
  contents: Contents
  filterOptions: {
    status: ActivityStatus
    sortBy: SortBy
    sortOrder: SortOrder
    kind: ActivityKind
  }
  settings: {
    refreshInterval: number
    triggerImage: string
  }
}

export type SortOrder = 'asc' | 'desc'
export type ActivityStatus = 'ongoing' | 'completed' | 'upcoming' | 'all'
export type ActivityKind = 'assignment' | 'video' | 'all'
export type SortBy = 'endAt' | 'startAt'
