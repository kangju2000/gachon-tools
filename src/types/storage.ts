import type { Contents } from '.'

export type StorageData = {
  meta: {
    version: string
    updateAt: string
  }
  contents: Contents
  settings: {
    refreshInterval: number
    triggerImage: string
    filterOptions: {
      status: ActivityStatus
      sortBy: SortBy
      sortOrder: SortOrder
      kind: ActivityKind
    }
  }
}

export type SortOrder = 'asc' | 'desc'
export type ActivityStatus = 'ongoing' | 'completed' | 'upcoming' | 'all'
export type ActivityKind = 'assignment' | 'video' | 'all'
export type SortBy = 'endAt' | 'startAt'
