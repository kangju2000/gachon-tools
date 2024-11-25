import { Keyboard } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SettingItem } from './SettingItem'
import { KOREAN_TO_ENGLISH, SHORTCUTS } from '@/constants'
import { useShortcutStore } from '@/storage/useShortcutStore'
import { useStorageStore } from '@/storage/useStorageStore'
import { cn } from '@/utils/cn'
import { isMac } from '@/utils/isMac'

const formatShortcutForDisplay = (shortcut: string) => {
  return shortcut
    .split('+')
    .map(key => {
      if (key === 'meta') return isMac ? '⌘' : 'Win'
      if (key === 'alt') return isMac ? '⌥' : 'Alt'
      if (key === 'ctrl') return isMac ? '⌃' : 'Ctrl'
      if (key === 'shift') return isMac ? '⇧' : 'Shift'
      return key.charAt(0).toUpperCase() + key.slice(1)
    })
    .join(' + ')
}

export function Shortcut() {
  const { settings, updateData } = useStorageStore()
  const { isEditing, setIsEditing } = useShortcutStore()
  const [tempShortcut, setTempShortcut] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const shortcutInputRef = useRef<HTMLInputElement>(null)

  const displayShortcut = useMemo(() => formatShortcutForDisplay(settings.shortcut), [settings.shortcut])

  const handleShortcutChange = useCallback((event: KeyboardEvent) => {
    event.preventDefault()
    const { ctrlKey, metaKey, altKey, shiftKey, key } = event

    if (key === 'Escape') {
      reset()
      return
    }

    if (key.length === 1 || ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(key)) {
      let processedKey = key.toLowerCase()

      if (KOREAN_TO_ENGLISH[processedKey as keyof typeof KOREAN_TO_ENGLISH]) {
        processedKey = KOREAN_TO_ENGLISH[processedKey as keyof typeof KOREAN_TO_ENGLISH]
      }

      const newShortcut = [
        (isMac ? metaKey : ctrlKey) && (isMac ? 'meta' : 'ctrl'),
        !isMac && metaKey && 'meta',
        altKey && 'alt',
        shiftKey && 'shift',
        processedKey,
      ]
        .filter(Boolean)
        .join('+')

      if (SHORTCUTS.includes(newShortcut)) {
        setTempShortcut(newShortcut)
        setErrorMessage('내장된 단축키는 사용할 수 없습니다.')
        return
      }

      setTempShortcut(newShortcut)
      setErrorMessage('')
    }
  }, [])

  const handleInputFocus = () => {
    setIsEditing(true)
    setErrorMessage('')
  }

  const reset = () => {
    setIsEditing(false)
    setTempShortcut('')
    setErrorMessage('')
  }

  const handleSave = () => {
    if (tempShortcut) {
      updateData('settings', prev => ({ ...prev, shortcut: tempShortcut }))
    }

    reset()
  }

  useEffect(() => reset, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing) {
        handleShortcutChange(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, handleShortcutChange])

  return (
    <SettingItem title="단축키 설정" description="GachonTools를 열고 닫을 단축키를 설정합니다.">
      <div className="space-y-3">
        <div className="relative">
          <input
            ref={shortcutInputRef}
            type="text"
            className={cn(
              'd-input d-input-bordered w-full pr-10 transition-all duration-200',
              isEditing ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300',
              errorMessage && 'border-red-500',
            )}
            value={
              isEditing
                ? tempShortcut
                  ? formatShortcutForDisplay(tempShortcut)
                  : '새 단축키 입력...'
                : displayShortcut
            }
            onFocus={handleInputFocus}
            readOnly
            placeholder="클릭하여 단축키 설정"
          />
          <Keyboard
            size={20}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isEditing ? 'text-blue-500' : 'text-gray-400',
            )}
            onClick={() => {
              setIsEditing(true)
              shortcutInputRef.current?.focus()
            }}
          />
        </div>

        {isEditing && (
          <div className="rounded-md bg-blue-50 p-3">
            <p className={cn('mb-2 text-sm', errorMessage ? 'text-red-500' : 'text-gray-700')}>
              {errorMessage || '새로운 단축키를 입력하세요. ESC를 눌러 취소할 수 있습니다.'}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={reset}
                className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  tempShortcut && !errorMessage ? 'bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed bg-blue-300',
                )}
                disabled={!tempShortcut || !!errorMessage}
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingItem>
  )
}
