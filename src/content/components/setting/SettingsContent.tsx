import { Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { ImageCropModal } from './ImageCropModal'
import { SettingItem } from './SettingItem'
import packageJson from '../../../../package.json'
import { useStorageStore } from '@/storage/useStorageStore'

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
  const [isHovering, setIsHovering] = useState(false)

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
      updateSettings({ triggerImage: croppedImage })
      setIsCropModalOpen(false)
    },
    [updateSettings],
  )

  const handleRefreshIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRefreshInterval = Number(event.target.value)
    updateSettings({ refreshInterval: newRefreshInterval })
  }

  return (
    <>
      <div className="bg-white bg-opacity-50 px-16px py-12px">
        <div className="mb-12px flex h-32px items-center justify-between">
          <h2 className="text-16px font-bold">설정</h2>
        </div>
      </div>

      <div {...getRootProps()} className="relative flex flex-1 flex-col gap-16px overflow-y-auto px-16px py-20px">
        <input {...getInputProps()} ref={inputRef} />
        {isDragActive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-lg font-semibold text-gray-700">이미지를 여기에 놓아주세요</p>
            </div>
          </div>
        )}

        <SettingItem title="새로고침 시간" description="새로고침 시간을 설정합니다.">
          <select
            className="d-select d-select-bordered d-select-sm w-full max-w-200px"
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

        <SettingItem
          title="버튼 이미지"
          description="버튼의 배경 이미지를 설정합니다.
파일을 끌어다 놓거나 클릭하여 이미지를 업로드하세요."
        >
          <div
            className="relative h-72px w-72px flex-shrink-0 overflow-hidden rounded-md border-2px border-gray-300"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img src={settings.triggerImage} alt="버튼 이미지 미리보기" className="h-full w-full object-cover" />

            {isHovering && (
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-24px w-24px text-white" />
              </div>
            )}
          </div>
        </SettingItem>

        {isCropModalOpen && image && (
          <ImageCropModal image={image} onComplete={handleCropComplete} onClose={() => setIsCropModalOpen(false)} />
        )}
        <span className="absolute bottom-12px right-12px text-12px text-gray-500">v{version}</span>
      </div>
    </>
  )
}
