import { create } from 'zustand'

import { chromeStorageClient } from './chromeStorageClient'
import packageJson from '../../package.json'
import { filterActivities } from '@/content/components/task/filterActivities'
import type { Activity, StorageData } from '@/types'
import { isMac } from '@/utils/isMac'

interface StorageStore extends StorageData {
  isInitialized: boolean
  initialize: () => Promise<void>
  updateData: <K extends keyof StorageData>(key: K, updater: (prev: StorageData[K]) => StorageData[K]) => Promise<void>
  getFilteredActivities: (searchQuery: string) => Activity[]
  resetStore: () => Promise<void>
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
    shortcut: isMac ? 'meta+/' : 'Ctrl+/',
  },
}

const mergeData = (initial: StorageData, stored: Partial<StorageData>): StorageData => ({
  meta: { ...initial.meta, ...stored.meta, version: packageJson.version },
  contents: { ...initial.contents, ...stored.contents },
  filterOptions: { ...initial.filterOptions, ...stored.filterOptions },
  settings: { ...initial.settings, ...stored.settings },
})

export const useStorageStore = create<StorageStore>((set, get) => ({
  ...initialStorageData,
  isInitialized: false,

  initialize: async () => {
    const storedData = await chromeStorageClient.getData()
    const mergedData = mergeData(initialStorageData, storedData)
    await chromeStorageClient.setData(mergedData)
    set({ ...mergedData, isInitialized: true })
  },

  updateData: async <K extends keyof StorageData>(key: K, updater: (prev: StorageData[K]) => StorageData[K]) => {
    const updatedData = updater(get()[key])
    await chromeStorageClient.updateDataByKey(key, () => updatedData)
    set(state => ({ ...state, [key]: updatedData }))
  },

  getFilteredActivities: (searchQuery: string) =>
    get()
      .contents.activityList.filter(activity => filterActivities(activity, { ...get().filterOptions, searchQuery }))
      .sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime()),

  resetStore: async () => {
    await chromeStorageClient.setData(initialStorageData)
    set({ ...initialStorageData, isInitialized: true })
  },
}))

useStorageStore.getState().initialize()

chromeStorageClient.onStorageChanged(changes => {
  const newState = Object.entries(changes).reduce((acc, [key, { newValue }]) => {
    if (key in initialStorageData) {
      acc[key as keyof StorageData] = newValue
    }
    return acc
  }, {} as Partial<StorageData>)

  if (Object.keys(newState).length > 0) {
    useStorageStore.setState(state => ({ ...state, ...newState }))
  }
})
