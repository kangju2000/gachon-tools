import { AnimatePresence } from 'framer-motion'
import { Camera, Palette } from 'lucide-react'
import { useCallback, useState } from 'react'
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
