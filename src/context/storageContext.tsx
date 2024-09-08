import React, { createContext, useContext, useState, useCallback } from 'react'
import { createChromeStorageStateHookLocal } from 'use-chrome-storage'

import packageJson from '../../package.json'
import type { StorageData } from '@/types'

const STORAGE_KEY = 'data'

const DEFAULT_STORAGE_DATA: StorageData['data'] = {
  meta: {
    version: packageJson.version,
    updateAt: new Date().toISOString(),
  },
  contents: {
    courseList: [{ id: '-1', title: '전체' }],
    activityList: [],
  },
  settings: {
    refreshInterval: 1000 * 60 * 20, // 20 minutes
    triggerImage: chrome.runtime.getURL('/assets/Lee-Gil-ya.webp'),
  },
}

interface StorageContextType {
  data: StorageData['data'] | null
  isLoading: boolean
  updateData: (newData: Partial<StorageData['data']>) => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [storageHook] = useState(() => createChromeStorageStateHookLocal(STORAGE_KEY, DEFAULT_STORAGE_DATA))
  const [storage, setStorage, , , isInitialStateResolved] = storageHook()

  const updateData = useCallback(
    (newData: Partial<StorageData['data']>) => {
      setStorage(prevData => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          ...newData.settings,
        },
        contents: {
          ...prevData.contents,
          ...newData.contents,
        },
        meta: {
          ...prevData.meta,
          ...newData.meta,
        },
      }))
    },
    [setStorage],
  )

  const value = {
    data: storage,
    isLoading: !isInitialStateResolved,
    updateData,
  }

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}
