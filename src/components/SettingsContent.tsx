import { SettingItem } from './SettingItem'

export function SettingsContent() {
  return (
    <div className="flex-1 space-y-12px overflow-y-auto px-10px py-20px">
      <SettingItem title="알림" description="과제 마감 알림 받기">
        <input type="checkbox" className="d-toggle d-toggle-primary" />
      </SettingItem>
      <SettingItem title="자동 새로고침" description="10분마다 과제 목록 갱신">
        <input type="checkbox" className="d-toggle d-toggle-primary" />
      </SettingItem>
      <SettingItem title="언어" description="앱 표시 언어 선택">
        <select className="d-select d-select-bordered d-select-sm">
          <option>한국어</option>
          <option>English</option>
          <option>日本語</option>
        </select>
      </SettingItem>
    </div>
  )
}
