import { create } from 'zustand'

import { chromeStorageClient } from './chromeStorageClient'
import type { StorageData } from '@/types'

type Status = 'initializing' | 'ready' | 'error' | 'isLoading'

interface StorageStore extends StorageData {
  status: Status
  error: string | null
  updateData: (newData: Partial<StorageData>) => Promise<void>
}

const createStorageStore = () => {
  let initializationPromise: Promise<StorageData> | null = null

  const initialStore: StorageStore = {
    meta: { version: '', updateAt: '' },
    contents: { courseList: [], activityList: [] },
    settings: {
      refreshInterval: 0,
      triggerImage: '',
      filterOptions: { status: 'ongoing', sortBy: 'endAt', sortOrder: 'asc', kind: 'all' },
    },
    status: 'initializing',
    error: null,
    updateData: async () => {},
  }

  const useStorageStore = create<StorageStore>(set => ({
    ...initialStore,

    updateData: async (newData: Partial<StorageData>) => {
      set({ status: 'isLoading' })
      try {
        await chromeStorageClient.setData(newData)
        const updatedData = await chromeStorageClient.getData()
        set({ ...updatedData, status: 'ready', error: null })
      } catch (error) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    },
  }))

  const initializeStore = async (): Promise<StorageData> => {
    if (!initializationPromise) {
      initializationPromise = chromeStorageClient.getData().then(
        data => {
          useStorageStore.setState({ ...data, status: 'ready', error: null })
          return data
        },
        error => {
          useStorageStore.setState({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
          throw error
        },
      )
    }
    return initializationPromise
  }

  initializeStore()

  return useStorageStore
}

export const useStorageStore = createStorageStore()
