import type { StorageData } from '@/types'

class ChromeStorageClient {
  private static instance: ChromeStorageClient
  private storageArea: chrome.storage.StorageArea

  private constructor() {
    this.storageArea = chrome.storage.sync || chrome.storage.local
  }

  public static getInstance(): ChromeStorageClient {
    if (!ChromeStorageClient.instance) {
      ChromeStorageClient.instance = new ChromeStorageClient()
    }
    return ChromeStorageClient.instance
  }

  public async getData(): Promise<StorageData> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(null, result => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve(result as StorageData)
        }
      })
    })
  }

  public async setData(data: Partial<StorageData>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve()
        }
      })
    })
  }

  public async removeData(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.remove(keys, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve()
        }
      })
    })
  }

  public async clearData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.clear(() => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve()
        }
      })
    })
  }

  public async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.clear(() => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve()
        }
      })
    })
  }

  public async getDataByKey<K extends keyof StorageData>(key: K): Promise<StorageData[K]> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(key, result => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve(result[key] as StorageData[K])
        }
      })
    })
  }

  public async updateDataByKey<K extends keyof StorageData>(
    key: K,
    updateFn: (prevValue: StorageData[K]) => StorageData[K],
  ): Promise<void> {
    const currentValue = await this.getDataByKey(key)
    const newValue = updateFn(currentValue)
    await this.setData({ [key]: newValue } as Partial<StorageData>)
  }

  public onStorageChanged(
    callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void,
  ): void {
    chrome.storage.onChanged.addListener(callback)
  }

  public removeStorageChangedListener(
    callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void,
  ): void {
    chrome.storage.onChanged.removeListener(callback)
  }
}

export const chromeStorageClient = ChromeStorageClient.getInstance()
