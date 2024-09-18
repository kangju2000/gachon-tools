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
    triggerImage: string
  }
}

export type ActivityStatus = 'ongoing' | 'all'

export type FilterOptions = {
  status: ActivityStatus
  courseId: string
}
