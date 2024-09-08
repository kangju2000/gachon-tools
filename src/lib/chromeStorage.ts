import type { ActivityType } from '@/types'

export interface StorageData {
  courses: { id: string; title: string }[]
  activities: ActivityType[]
  updateAt: string
  settings: {
    refreshTime: number
  }
}

export async function getStorageData<T extends keyof StorageData>(key: T): Promise<StorageData[T]> {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      resolve(result[key] as StorageData[T])
    })
  })
}

export async function setStorageData<T extends keyof StorageData>(key: T, value: StorageData[T]): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, resolve)
  })
}

export async function getAllStorageData(): Promise<Partial<StorageData>> {
  return new Promise(resolve => {
    chrome.storage.local.get(null, result => {
      resolve(result as Partial<StorageData>)
    })
  })
}

export const DEFAULT_SETTINGS: StorageData['settings'] = {
  refreshTime: 1000 * 60 * 20, // 20 minutes
}
