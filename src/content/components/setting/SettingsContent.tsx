import { AnimatePresence } from 'framer-motion'
import { Camera, Palette } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { ColorPickerModal } from './ColorPickerModal'
import { ImageCropModal } from './ImageCropModal'
import { SettingItem } from './SettingItem'
import packageJson from '../../../../package.json'
import { useStorageStore } from '@/storage/useStorageStore'
import { cn } from '@/utils/cn'

const { version } = packageJson

const refreshIntervalOptions = [
  { value: 1000 * 60 * 5, label: '5분' },
  { value: 1000 * 60 * 10, label: '10분' },
  { value: 1000 * 60 * 20, label: '20분' },
  { value: 1000 * 60 * 30, label: '30분' },
  { value: 1000 * 60 * 60, label: '1시간' },
  { value: 1000 * 60 * 120, label: '2시간' },
]

export function SettingsContent() {
  const { settings, updateSettings } = useStorageStore()
  const [image, setImage] = useState<string | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImage(URL.createObjectURL(file))
    setIsCropModalOpen(true)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    noClick: true,
    maxSize: 1024 * 1024 * 2,
  })

  const handleCropComplete = useCallback(
    async (croppedImage: string) => {
      updateSettings({ trigger: { type: 'image', image: croppedImage } })
      setIsCropModalOpen(false)
    },
    [updateSettings],
  )

  const handleRefreshIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRefreshInterval = Number(event.target.value)
    updateSettings({ refreshInterval: newRefreshInterval })
  }

  const renderTriggerPreview = () => {
    switch (settings.trigger.type) {
      case 'image':
        return <img src={settings.trigger.image} alt="버튼 이미지" className="h-full w-full object-cover" />
      case 'color':
        return <div className="h-full w-full" style={{ background: settings.trigger.color }} />
    }
  }

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
          <SettingItem title="새로고침 시간" description="과제 목록을 자동으로 갱신할 간격을 설정합니다.">
            <select
              className="d-select d-select-bordered w-full"
              value={settings.refreshInterval}
              onChange={handleRefreshIntervalChange}
            >
              {refreshIntervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingItem>
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
              updateSettings({ trigger: { type: 'color', color: value } })
              setIsColorPickerOpen(false)
            }}
            onClose={() => setIsColorPickerOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-8px left-16px">
        <span className="text-12px text-gray-500">버전 {version}</span>
      </div>
    </div>
  )
}
