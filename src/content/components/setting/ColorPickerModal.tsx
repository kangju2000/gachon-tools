import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'

import { cn } from '@/utils/cn'

type ColorPickerModalProps = {
  onComplete: (value: string) => void
  onClose: () => void
}

const colorOptions = [
  { value: '#F44336', label: '빨강' },
  { value: '#E91E63', label: '분홍' },
  { value: '#9C27B0', label: '보라' },
  { value: '#673AB7', label: '진보라' },
  { value: '#3F51B5', label: '남색' },
  { value: '#2196F3', label: '파랑' },
  { value: '#03A9F4', label: '하늘색' },
  { value: '#00BCD4', label: '청록' },
  { value: '#009688', label: '틸' },
  { value: '#4CAF50', label: '초록' },
  { value: '#8BC34A', label: '연두' },
  { value: '#CDDC39', label: '라임' },
  { value: '#FFEB3B', label: '노랑' },
  { value: '#FFC107', label: '황색' },
  { value: '#FF9800', label: '주황' },
  { value: '#FF5722', label: '심홍' },
  { value: '#795548', label: '갈색' },
  { value: '#9E9E9E', label: '회색' },
  { value: '#607D8B', label: '청회색' },
  { value: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)', label: '빨강-청록 그라데이션' },
  { value: 'linear-gradient(135deg, #A770EF, #CF8BF3, #FDB99B)', label: '보라-분홍-주황 그라데이션' },
  { value: 'linear-gradient(135deg, #667eea, #764ba2)', label: '파랑-보라 그라데이션' },
  { value: 'linear-gradient(135deg, #11998e, #38ef7d)', label: '청록-연두 그라데이션' },
  { value: 'linear-gradient(135deg, #FC466B, #3F5EFB)', label: '분홍-파랑 그라데이션' },
  { value: 'linear-gradient(135deg, #FDBB2D, #22C1C3)', label: '황색-청록 그라데이션' },
  { value: 'linear-gradient(135deg, #F761A1, #8C1BAB)', label: '분홍-보라 그라데이션' },
  { value: 'linear-gradient(135deg, #43CBFF, #9708CC)', label: '하늘-보라 그라데이션' },
  { value: 'linear-gradient(135deg, #5433FF, #20BDFF, #A5FECB)', label: '보라-파랑-연두 그라데이션' },
  { value: 'linear-gradient(135deg, #FFD26F, #3677FF)', label: '황색-파랑 그라데이션' },
]

export function ColorPickerModal({ onComplete, onClose }: ColorPickerModalProps) {
  const [selectedValue, setSelectedValue] = useState('transparent')

  const handleComplete = useCallback(() => {
    onComplete(selectedValue)
  }, [selectedValue, onComplete])

  const handleColorSelect = (value: string) => {
    setSelectedValue(value)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'Enter') {
        handleComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleComplete, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="flex h-400px w-300px flex-col rounded-12px bg-white p-12px">
        <h3 className="mb-8px text-center text-16px font-bold">색상 선택</h3>
        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 z-10 h-16px bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-16px bg-gradient-to-t from-white to-transparent"></div>
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <div className="flex justify-center pt-12px">
              <div className="grid grid-cols-4 gap-3 p-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    className={`h-48px w-48px rounded-full ${
                      selectedValue === color.value ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ background: color.value }}
                    onClick={() => handleColorSelect(color.value)}
                    aria-label={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8px flex items-center justify-between">
          <button onClick={onClose} className="rounded bg-gray-200 px-12px py-6px transition-colors hover:bg-gray-300">
            취소
          </button>
          <div
            className={cn('d-mask d-mask-squircle relative h-48px w-48px overflow-hidden', {})}
            style={{ background: selectedValue }}
          />
          <button
            onClick={handleComplete}
            className="rounded bg-blue-500 px-12px py-6px text-white transition-colors hover:bg-blue-600"
          >
            완료
          </button>
        </div>
      </div>
    </motion.div>
  )
}
