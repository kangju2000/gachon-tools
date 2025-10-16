import { AnimatePresence } from 'framer-motion'
import { Camera, Palette } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

import { ColorPickerModal } from './ColorPickerModal'
import { ImageCropModal } from './ImageCropModal'
import { SettingItem } from './SettingItem'
import { Shortcut } from './Shortcut'
import packageJson from '../../../../package.json'
import { useStorageStore } from '@/storage/useStorageStore'
import { cn } from '@/utils/cn'

const { version } = packageJson

const REFRESH_INTERVAL_OPTIONS = [
  { value: 1000 * 60 * 5, label: '5분' },
  { value: 1000 * 60 * 10, label: '10분' },
  { value: 1000 * 60 * 20, label: '20분' },
  { value: 1000 * 60 * 30, label: '30분' },
  { value: 1000 * 60 * 60, label: '1시간' },
  { value: 1000 * 60 * 120, label: '2시간' },
]

const MAX_IMAGE_SIZE = 1024 * 1024 * 4 // 4MB

export function SettingsContent() {
  const { settings, updateData } = useStorageStore()
  const [image, setImage] = useState<string | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [hoursText, setHoursText] = useState('')
  const [daysText, setDaysText] = useState('')
  const [notifLevel, setNotifLevel] = useState<'granted' | 'denied' | 'default' | 'unknown'>('unknown')
  const [lastTestFailed, setLastTestFailed] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (!file) {
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`이미지는 ${MAX_IMAGE_SIZE / 1024 / 1024}MB 이하로 업로드해주세요`)
      return
    }

    setImage(URL.createObjectURL(file))
    setIsCropModalOpen(true)
  }, [])

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onError: () => {
      toast.error('이미지 업로드에 실패했어요')
    },
  })

  const handleCropComplete = useCallback(
    async (croppedImage: string) => {
      updateData('settings', prev => ({ ...prev, trigger: { type: 'image', image: croppedImage } }))

      setIsCropModalOpen(false)
      setImage(null)

      toast.success('이미지가 성공적으로 업로드되었어요')
    },
    [updateData],
  )

  const renderTriggerPreview = () => {
    switch (settings.trigger.type) {
      case 'image':
        return <img src={settings.trigger.image} alt="버튼 이미지" className="h-full w-full object-cover" />
      case 'color':
        return <div className="h-full w-full" style={{ background: settings.trigger.color }} />
    }
  }

  const parseNumbers = (input: string): number[] => {
    const raw = input.trim()
    if (raw === '') return []
    return Array.from(
      new Set(
        raw
          .split(',')
          .map(v => v.trim())
          .filter(v => v !== '' && /^\d+$/.test(v))
          .map(v => parseInt(v, 10))
          .filter(n => n >= 0),
      ),
    )
  }

  useEffect(() => {
    setHoursText((settings.reminders?.hoursBefore ?? []).join(', '))
    setDaysText((settings.reminders?.daysBefore ?? []).join(', '))
  }, [settings.reminders?.hoursBefore, settings.reminders?.daysBefore])

  const commitHours = (text: string) => {
    const inputHours = parseNumbers(text)
    updateData('settings', prev => {
      const prevDays = prev.reminders?.daysBefore ?? []
      const moveToDays = inputHours.filter(h => h >= 24 && h % 24 === 0).map(h => h / 24)
      const remainingHours = inputHours.filter(h => !(h >= 24 && h % 24 === 0))
      const daysBefore = Array.from(new Set([...prevDays, ...moveToDays]))
      return {
        ...prev,
        reminders: {
          hoursBefore: remainingHours,
          daysBefore,
        },
      }
    })
  }

  const commitDays = (text: string) => {
    const values = parseNumbers(text)
    updateData('settings', prev => ({
      ...prev,
      reminders: {
        hoursBefore: prev.reminders?.hoursBefore ?? [],
        daysBefore: values,
      },
    }))
  }

  const queryNotificationPermission = useCallback(() => {
    try {
      const fn = chrome.notifications?.getPermissionLevel
      if (typeof fn === 'function') {
        fn((level: string) => setNotifLevel((level as 'granted' | 'denied' | 'default') || 'unknown'))
        return
      }
      // fallback to web Notification API if available
      const webPerm = (globalThis as unknown as { Notification?: { permission?: 'granted' | 'denied' | 'default' } })
        .Notification?.permission
      setNotifLevel(webPerm || 'unknown')
    } catch {
      setNotifLevel('unknown')
    }
  }, [])

  useEffect(() => {
    queryNotificationPermission()
  }, [queryNotificationPermission])

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-gray-50">
      <div className="mb-12px mt-4px bg-white bg-opacity-50 px-16px py-12px">
        <h2 className="text-16px font-bold">설정</h2>
      </div>

      <div className="flex flex-col gap-16px p-16px">
        <div className="rounded-lg bg-white p-16px shadow-sm">
          <div className="flex items-center justify-center">
            <div {...getRootProps()} className="relative">
              <div
                className={cn(
                  'relative rounded-full',
                  isDragActive ? 'border-2px border-dashed border-blue-500' : 'border-2px border-transparent',
                )}
              >
                <div className="relative h-120px w-120px overflow-hidden rounded-full">
                  {renderTriggerPreview()}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                    <div className="flex gap-2">
                      <button
                        className="flex h-36px w-36px cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-75 transition-all duration-200 hover:bg-opacity-100"
                        onClick={() => inputRef.current?.click()}
                      >
                        <Camera size={20} className="text-gray-700" />
                      </button>
                      <button
                        className="flex h-36px w-36px cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-75 transition-all duration-200 hover:bg-opacity-100"
                        onClick={() => setIsColorPickerOpen(true)}
                      >
                        <Palette size={20} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-16px shadow-sm">
          <SettingItem
            title="웹 UI 개선"
            description="사이버캠퍼스의 좌측 메뉴 축소/숨김 버튼과 반응형 스타일을 적용합니다."
          >
            <div className="flex flex-col gap-8px">
              <label htmlFor="ui-enhance" className="flex items-center gap-8px">
                <input
                  id="ui-enhance"
                  type="checkbox"
                  className="d-toggle"
                  checked={Boolean(settings.webUiEnhancement)}
                  onChange={e => updateData('settings', prev => ({ ...prev, webUiEnhancement: e.target.checked }))}
                />
                <span className="text-13px text-gray-700">웹 UI 개선 활성화</span>
              </label>

              <label htmlFor="hide-popups" className="flex items-center gap-8px">
                <input
                  id="hide-popups"
                  type="checkbox"
                  className="d-toggle"
                  checked={Boolean(settings.webUiHidePopups)}
                  onChange={e => updateData('settings', prev => ({ ...prev, webUiHidePopups: e.target.checked }))}
                />
                <span className="text-13px text-gray-700">공지 팝업창 숨기기</span>
              </label>
            </div>
          </SettingItem>
        </div>

        <div className="rounded-lg bg-white p-16px shadow-sm">
          <SettingItem title="새로고침 시간" description="과제 목록을 자동으로 갱신할 간격을 설정합니다.">
            <select
              className="d-select d-select-bordered w-full"
              value={settings.refreshInterval}
              onChange={event =>
                updateData('settings', prev => ({
                  ...prev,
                  refreshInterval: Number(event.target.value),
                }))
              }
            >
              {REFRESH_INTERVAL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingItem>
        </div>

        <div className="rounded-lg bg-white p-16px shadow-sm">
          <SettingItem
            title="리마인드 알림"
            description={'마감 전에 알림을 표시합니다. 시간/일 단위로 여러 값을 쉼표로 입력하세요 (예: 1,3,6).'}
          >
            <div className="grid grid-cols-1 gap-8px md:grid-cols-2">
              <div>
                <label className="mb-4px block text-11px text-gray-600">시간 전</label>
                <input
                  type="text"
                  className="d-input d-input-bordered w-full"
                  value={hoursText}
                  onChange={e => setHoursText(e.target.value)}
                  onBlur={() => commitHours(hoursText)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      commitHours(hoursText)
                    }
                  }}
                  placeholder="1, 3, 6"
                />
              </div>
              <div>
                <label className="mb-4px block text-11px text-gray-600">일 전</label>
                <input
                  type="text"
                  className="d-input d-input-bordered w-full"
                  value={daysText}
                  onChange={e => setDaysText(e.target.value)}
                  onBlur={() => commitDays(daysText)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      commitDays(daysText)
                    }
                  }}
                  placeholder="1, 2"
                />
              </div>
            </div>
            <div className="mt-8px flex flex-wrap items-center gap-8px">
              <button
                className="d-btn d-btn-sm"
                onClick={async () => {
                  setLastTestFailed(false)
                  try {
                    await chrome.runtime.sendMessage({ type: 'sendTestNotification' })
                    toast.success('테스트 알림을 전송했어요')
                  } catch (e) {
                    setLastTestFailed(true)
                    toast.error('알림을 표시할 수 없습니다. 브라우저 알림을 확인하세요.')
                  } finally {
                    queryNotificationPermission()
                  }
                }}
              >
                테스트 알림 보내기
              </button>

              <span className={cn('text-12px', notifLevel === 'denied' ? 'text-red-600' : 'text-gray-600')}>
                권한 상태:{' '}
                {({ granted: '허용', denied: '차단', default: '미설정' } as Record<string, string>)[notifLevel] ??
                  '확인 불가'}
              </span>

              {lastTestFailed && (
                <a
                  className="text-12px text-blue-600 underline"
                  href="https://support.google.com/chrome/answer/3220216?hl=ko"
                  target="_blank"
                  rel="noreferrer"
                >
                  알림이 안 뜨면? 권한 설정 방법 보기
                </a>
              )}
            </div>
          </SettingItem>
        </div>

        <div className="rounded-lg bg-white p-16px shadow-sm">
          <Shortcut />
        </div>
      </div>

      <input {...getInputProps()} ref={inputRef} className="hidden" />

      <AnimatePresence>
        {isCropModalOpen && image && (
          <ImageCropModal
            image={image}
            onComplete={handleCropComplete}
            onClose={() => {
              setIsCropModalOpen(false)
              setImage(null)
            }}
          />
        )}

        {isColorPickerOpen && (
          <ColorPickerModal
            onComplete={value => {
              updateData('settings', prev => ({ ...prev, trigger: { type: 'color', color: value } }))
              setIsColorPickerOpen(false)
            }}
            onClose={() => setIsColorPickerOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className="flex items-center justify-center gap-8px p-16px text-12px">
        <span className="text-gray-500">버전: {version}</span>
        <span className="text-gray-300">|</span>
        <a
          href="https://kangju2000.notion.site/Gachon-Tools-f01d077db229434abfce605c2d26f682"
          className="text-blue-500 hover:underline"
        >
          도움말
        </a>
        <span className="text-gray-300">|</span>
        <a href="https://forms.gle/1aVSbBfwbzw9753b7" className="text-blue-500 hover:underline">
          문의하기
        </a>
      </div>
    </div>
  )
}
