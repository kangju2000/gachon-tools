import { useState, useEffect } from 'react'

import { SettingItem } from './SettingItem'
import packageJson from '../../package.json'
import useGetContents from '@/hooks/useGetContents'
import { DEFAULT_SETTINGS, setStorageData } from '@/lib/chromeStorage'

const { version } = packageJson

const refreshTimeOptions = [
  { value: 1000 * 60 * 10, label: '10분' },
  { value: 1000 * 60 * 20, label: '20분' },
  { value: 1000 * 60 * 30, label: '30분' },
  { value: 1000 * 60 * 60, label: '1시간' },
  { value: 1000 * 60 * 120, label: '2시간' },
]

export function SettingsContent() {
  const { settings, setSettings } = useGetContents({ enabled: false })
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    setAutoRefresh(settings.refreshTime !== 0)
  }, [settings.refreshTime])

  const handleRefreshTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRefreshTime = Number(event.target.value)
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, refreshTime: newRefreshTime }
      setStorageData('settings', newSettings)
      return newSettings
    })
  }

  const handleAutoRefreshToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAutoRefresh = event.target.checked
    setAutoRefresh(isAutoRefresh)
    setSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        refreshTime: isAutoRefresh ? prevSettings.refreshTime || DEFAULT_SETTINGS.refreshTime : 0,
      }
      setStorageData('settings', newSettings)
      return newSettings
    })
  }

  return (
    <div className="relative flex-1 space-y-12px overflow-y-auto px-12px py-20px">
      <SettingItem title="자동 새로고침" description="주기적으로 과제 목록 갱신">
        <input
          type="checkbox"
          className="d-toggle border-blue-500 bg-blue-500 hover:bg-blue-700"
          checked={autoRefresh}
          onChange={handleAutoRefreshToggle}
        />
      </SettingItem>
      {autoRefresh && (
        <SettingItem title="갱신 주기" description="과제 목록 갱신 간격 설정">
          <select
            className="d-select d-select-bordered d-select-sm"
            value={settings.refreshTime}
            onChange={handleRefreshTimeChange}
          >
            {refreshTimeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingItem>
      )}
      <span className="absolute bottom-12px right-12px text-12px text-gray-500">v{version}</span>
    </div>
  )
}
