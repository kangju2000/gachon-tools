import { create } from 'zustand'

import { chromeStorageClient } from './chromeStorageClient'
import packageJson from '../../package.json'
import { filterActivities } from '@/content/components/task/filterActivities'
import type { Activity, StorageData } from '@/types'
import { isMac } from '@/utils/isMac'

type Status = 'initializing' | 'ready' | 'error' | 'loading'

interface StorageStore extends StorageData {
  status: Status
  error: string | null
  initialize: () => void
  updateData: <K extends keyof StorageData>(key: K, updater: (prev: StorageData[K]) => StorageData[K]) => void
  getFilteredActivities: (searchQuery: string) => Activity[]
  resetStore: () => void
}

const initialStorageData: StorageData = {
  meta: { version: packageJson.version, updateAt: '2024-01-01T00:00:00.000Z' },
  contents: { courseList: [{ id: '-1', title: '전체 과목' }], activityList: [] },
  filterOptions: { status: 'ongoing', courseId: '-1' },
  settings: {
    refreshInterval: 1000 * 60 * 20,
    trigger: {
      type: 'image',
      image: chrome.runtime.getURL('/assets/Lee-Gil-ya.webp'),
    },
    shortcut: isMac ? '⌘ + /' : 'Ctrl + /',
  },
}

const mergeData = (initial: StorageData, stored: Partial<StorageData>): StorageData => ({
  meta: { ...initial.meta, ...stored.meta },
  contents: { ...initial.contents, ...stored.contents },
  filterOptions: { ...initial.filterOptions, ...stored.filterOptions },
  settings: { ...initial.settings, ...stored.settings },
})

export const useStorageStore = create<StorageStore>((set, get) => {
  const withAsyncHandler = async <T extends Partial<StorageData>>(operation: () => Promise<T>) => {
    set({ status: 'loading' })
    try {
      const result = await operation()
      set({ ...result, status: 'ready', error: null })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return {
    ...initialStorageData,
    status: 'initializing',
    error: null,

    initialize: () => {
      withAsyncHandler(async () => {
        const storedData = await chromeStorageClient.getData()
        const mergedData = mergeData(initialStorageData, storedData)
        await chromeStorageClient.setData(mergedData)
        return mergedData
      })
    },

    updateData: <K extends keyof StorageData>(key: K, updater: (prev: StorageData[K]) => StorageData[K]) => {
      withAsyncHandler(async () => {
        const updatedData = updater(get()[key])
        await chromeStorageClient.updateDataByKey(key, () => updatedData)
        return { [key]: updatedData } as Partial<StorageData>
      })
    },

    getFilteredActivities: (searchQuery: string) =>
      get()
        .contents.activityList.filter(activity => filterActivities(activity, { ...get().filterOptions, searchQuery }))
        .sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime()),

    resetStore: () => {
      withAsyncHandler(async () => {
        await chromeStorageClient.setData(initialStorageData)
        return initialStorageData
      })
    },
  }
})

useStorageStore.getState().initialize()

chromeStorageClient.onStorageChanged(changes => {
  const newState = Object.entries(changes).reduce((acc, [key, { newValue }]) => {
    if (key in initialStorageData) {
      acc[key as keyof StorageData] = newValue
    }
    return acc
  }, {} as Partial<StorageData>)

  if (Object.keys(newState).length > 0) {
    useStorageStore.setState(state => ({ ...state, ...newState, status: 'ready', error: null }))
  }
})
