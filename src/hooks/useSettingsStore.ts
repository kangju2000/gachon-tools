// common/useSettingsStore.js
import { createChromeStorageStateHookLocal } from 'use-chrome-storage'

import type { StorageData } from '@/lib/chromeStorage'

const DEFAULT_SETTINGS: StorageData['settings'] = {
  refreshTime: 1000 * 60 * 20, // 20 minutes
  'trigger-bg-image': '',
}

const SETTINGS_KEY = 'settings'

export const useSettingsStore = createChromeStorageStateHookLocal(SETTINGS_KEY, DEFAULT_SETTINGS)
