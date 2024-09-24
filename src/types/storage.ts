import type { Contents } from '.'

export type StorageData = {
  meta: {
    version: string
    updateAt: string
  }
  contents: Contents
  filterOptions: FilterOptions
  settings: {
    refreshInterval: number
    trigger: { type: 'image'; image: string } | { type: 'color'; color: string }
  }
}

export type ActivityStatus = 'ongoing' | 'all'

export type FilterOptions = {
  status: ActivityStatus
  courseId: string
}
