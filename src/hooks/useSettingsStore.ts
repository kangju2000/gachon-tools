import { createChromeStorageStateHookLocal } from 'use-chrome-storage'

import type { StorageData } from '@/lib/chromeStorage'

const DEFAULT_SETTINGS: StorageData['settings'] = {
  refreshInterval: 1000 * 60 * 20, // 20 minutes
  triggerImage: '',
}

const SETTINGS_KEY = 'settings'

export const useSettingsStore = createChromeStorageStateHookLocal(SETTINGS_KEY, DEFAULT_SETTINGS)
