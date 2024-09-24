import { motion } from 'framer-motion'
import React, { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '@/utils/cropImage'

import type { Point, Area } from 'react-easy-crop'

type ImageCropModalProps = {
  image: string
  onComplete: (croppedImage: string) => void
  onClose: () => void
}

export function ImageCropModal({ image, onComplete, onClose }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleComplete = useCallback(async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onComplete(croppedImage)
    }
  }, [croppedAreaPixels, image, onComplete])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Enter') {
        handleComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="flex h-400px w-300px flex-col gap-12px rounded-12px bg-white p-12px">
        <div className="relative h-full w-full overflow-hidden rounded-12px">
          <div className="absolute inset-0 bg-white" />
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            disableAutomaticStylesInjection
            style={{
              containerStyle: {
                backgroundColor: 'white',
              },
              mediaStyle: {
                backgroundColor: 'white',
              },
            }}
          />
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="rounded bg-gray-200 px-12px py-6px transition-colors hover:bg-gray-300">
            취소
          </button>
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
