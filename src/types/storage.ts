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
    shortcut: string
    reminders?: {
      hoursBefore: number[]
      daysBefore: number[]
    }
    webUiEnhancement?: boolean
    webUiHidePopups?: boolean
  }
  overrides: {
    hiddenActivityIds: string[]
    completedActivityIds: string[]
  }
  reminders: {
    enabledActivityIds: string[]
  }
}

export type ActivityStatus = 'ongoing' | 'all' | 'unsubmitted'

export type FilterOptions = {
  status: ActivityStatus
  selectedCourseIds: string[]
  showHidden?: boolean
}
