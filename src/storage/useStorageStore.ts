import { create } from 'zustand'

import { chromeStorageClient } from './chromeStorageClient'
import packageJson from '../../package.json'
import type { Activity, Course, StorageData } from '@/types'

type Status = 'initializing' | 'ready' | 'error' | 'loading'

interface ExtendedStorageData extends StorageData {
  status: Status
  error: string | null
}

type StorageStore = ExtendedStorageData & {
  initialize: () => Promise<void>
  updateMeta: (meta: Partial<StorageData['meta']>) => Promise<void>
  updateContents: (contents: Partial<StorageData['contents']>) => Promise<void>
  updateFilterOptions: (filterOptions: Partial<StorageData['filterOptions']>) => void
  updateSettings: (settings: Partial<StorageData['settings']>) => Promise<void>
  resetStore: () => Promise<void>
  getCourseById: (id: string) => Course | undefined
  getActivitiesByCourseId: (courseId: string) => Activity[]
  getFilteredActivities: (filter: (activity: Activity) => boolean) => StorageData['contents']['activityList']
}

const initialStorageData: StorageData = {
  meta: { version: packageJson.version, updateAt: '0' },
  contents: { courseList: [{ id: '-1', title: '전체 과목' }], activityList: [] },
  filterOptions: { status: 'ongoing', courseId: '-1' },
  settings: {
    refreshInterval: 1000 * 60 * 20, // 20 minutes
    triggerImage: chrome.runtime.getURL('/assets/Lee-Gil-ya.webp'),
  },
}

export const useStorageStore = create<StorageStore>((set, get) => ({
  ...initialStorageData,
  status: 'initializing' as Status,
  error: null,

  initialize: async () => {
    try {
      const data = await chromeStorageClient.getData()
      if (Object.keys(data).length === 0) {
        await chromeStorageClient.setData(initialStorageData)
        set({ ...initialStorageData, status: 'ready', error: null })
        return
      }

      set({ ...data, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  updateMeta: async (meta: Partial<StorageData['meta']>) => {
    set({ status: 'loading' })
    try {
      await chromeStorageClient.updateDataByKey('meta', prevMeta => ({ ...prevMeta, ...meta }))
      const updatedMeta = await chromeStorageClient.getDataByKey('meta')
      set({ meta: updatedMeta, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  updateContents: async (contents: Partial<StorageData['contents']>) => {
    set({ status: 'loading' })
    try {
      await chromeStorageClient.updateDataByKey('contents', prevContents => ({ ...prevContents, ...contents }))
      const updatedContents = await chromeStorageClient.getDataByKey('contents')
      set({ contents: updatedContents, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  updateFilterOptions: async (filterOptions: Partial<StorageData['filterOptions']>) => {
    set({ status: 'loading' })
    try {
      await chromeStorageClient.updateDataByKey('filterOptions', prevFilterOptions => ({
        ...prevFilterOptions,
        ...filterOptions,
      }))
      const updatedFilterOptions = await chromeStorageClient.getDataByKey('filterOptions')
      set({ filterOptions: updatedFilterOptions, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  updateSettings: async (settings: Partial<StorageData['settings']>) => {
    set({ status: 'loading' })
    try {
      await chromeStorageClient.updateDataByKey('settings', prevSettings => ({ ...prevSettings, ...settings }))
      const updatedSettings = await chromeStorageClient.getDataByKey('settings')
      set({ settings: updatedSettings, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  resetStore: async () => {
    set({ status: 'loading' })
    try {
      await chromeStorageClient.clearAllData()
      await chromeStorageClient.setData(initialStorageData)
      set({ ...initialStorageData, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  getCourseById: (id: string) => {
    return get().contents.courseList.find(course => course.id === id)
  },

  getActivitiesByCourseId: (courseId: string) => {
    return get().contents.activityList.filter(activity => activity.courseId === courseId)
  },

  getFilteredActivities: (filter: (activity: StorageData['contents']['activityList'][number]) => boolean) => {
    return get().contents.activityList.filter(filter)
  },
}))

useStorageStore.getState().initialize()

// Set up storage change listener
chromeStorageClient.onStorageChanged(changes => {
  const newState: Partial<StorageData> = {}

  if (changes.meta) {
    newState.meta = changes.meta.newValue
  }
  if (changes.contents) {
    newState.contents = changes.contents.newValue
  }
  if (changes.settings) {
    newState.settings = changes.settings.newValue
  }

  if (Object.keys(newState).length > 0) {
    useStorageStore.setState({ ...newState, status: 'ready', error: null })
  }
})
