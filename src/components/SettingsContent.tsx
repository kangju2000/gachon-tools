import { SettingItem } from './SettingItem'
import packageJson from '../../package.json'
import useGetContents from '@/hooks/useGetContents'
import { DEFAULT_SETTINGS, setStorageData } from '@/lib/chromeStorage'

const { version } = packageJson

const refreshTimeOptions = [
  { value: 1000 * 60 * 5, label: '5분' },
  { value: 1000 * 60 * 10, label: '10분' },
  { value: 1000 * 60 * 20, label: '20분' },
  { value: 1000 * 60 * 30, label: '30분' },
  { value: 1000 * 60 * 60, label: '1시간' },
  { value: 1000 * 60 * 120, label: '2시간' },
]

export function SettingsContent() {
  const { settings, setSettings } = useGetContents({ enabled: false })

  const handleRefreshTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRefreshTime = Number(event.target.value)
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, refreshTime: newRefreshTime }
      setStorageData('settings', newSettings)
      return newSettings
    })
  }

  return (
    <div className="relative flex-1 space-y-12px overflow-y-auto px-12px py-20px">
      <SettingItem title="새로고침 시간" description="새로고침 시간을 설정합니다.">
        <select
          className="d-select d-select-bordered"
          value={settings.refreshTime || DEFAULT_SETTINGS.refreshTime}
          onChange={handleRefreshTimeChange}
        >
          {refreshTimeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </SettingItem>
      <span className="absolute bottom-12px right-12px text-12px text-gray-500">v{version}</span>
    </div>
  )
}
