import packageJson from '../../package.json'
import type { StorageData } from '@/types'

const STORAGE_KEY = 'data'

const DEFAULT_STORAGE_DATA: StorageData = {
  meta: {
    version: packageJson.version,
    updateAt: '0',
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

export const chromeStorageClient = {
  async getData(): Promise<StorageData> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    return (result[STORAGE_KEY] as StorageData) || DEFAULT_STORAGE_DATA
  },

  async setData(newData: Partial<StorageData>): Promise<void> {
    const currentData = await chromeStorageClient.getData()
    const updatedData = { ...currentData, ...newData }
    await chrome.storage.local.set({ [STORAGE_KEY]: updatedData })
  },
}
