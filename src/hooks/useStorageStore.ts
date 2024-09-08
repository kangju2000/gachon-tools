import { createChromeStorageStateHookLocal } from 'use-chrome-storage'

import packageJson from '../../package.json'
import type { StorageData } from '@/types'

const STORAGE_KEY = 'data'

const DEFAULT_SETTINGS: StorageData['data'] = {
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

export const useStorageStore = () => {
  const chromeStorageStateHookLocal = createChromeStorageStateHookLocal(STORAGE_KEY, DEFAULT_SETTINGS)

  const [storage, setStorage, isPersistent, error, isInitialStateResolved] = chromeStorageStateHookLocal()

  const setMeta = (meta: Partial<StorageData['data']['meta']>) => {
    setStorage({ ...storage, meta: { ...storage.meta, ...meta } })
  }

  const setContents = (contents: Partial<StorageData['data']['contents']>) => {
    setStorage({ ...storage, contents: { ...storage.contents, ...contents } })
  }

  const setSettings = (settings: Partial<StorageData['data']['settings']>) => {
    setStorage({ ...storage, settings: { ...storage.settings, ...settings } })
  }

  return {
    storage,
    setMeta,
    setContents,
    setSettings,
    isPersistent,
    error,
    isInitialStateResolved,
  }
}
