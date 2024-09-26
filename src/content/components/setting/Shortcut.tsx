import { Keyboard } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { SettingItem } from './SettingItem'
import { useShortcutStore } from '@/storage/useShortcutStore'
import { useStorageStore } from '@/storage/useStorageStore'
import { cn } from '@/utils/cn'
import { isMac } from '@/utils/isMac'

const SHORTCUTS = [
  // 브라우저 및 일반적인 단축키
  'ctrl+t',
  'ctrl+n',
  'ctrl+shift+n',
  'ctrl+o',
  'ctrl+shift+t',
  'ctrl+w',
  'ctrl+shift+w',
  'ctrl+f4',
  'alt+f4',
  'ctrl+1',
  'ctrl+2',
  'ctrl+3',
  'ctrl+4',
  'ctrl+5',
  'ctrl+6',
  'ctrl+7',
  'ctrl+8',
  'ctrl+9',
  'ctrl+tab',
  'ctrl+shift+tab',
  'alt+left',
  'alt+right',
  'ctrl+r',
  'f5',
  'ctrl+f5',
  'ctrl+l',
  'ctrl+f',
  'ctrl+g',
  'ctrl+shift+g',
  'ctrl+h',
  'ctrl+j',
  'ctrl+d',
  'ctrl+shift+d',
  'ctrl+s',
  'ctrl+p',
  'f12',
  'ctrl+u',
  'ctrl++',
  'ctrl+-',
  'ctrl+0',
  'ctrl+a',
  'ctrl+c',
  'ctrl+v',
  'ctrl+x',
  'ctrl+z',
  'ctrl+y',
  'ctrl+b',
  'ctrl+i',
  // Mac 특화 단축키
  'meta+t',
  'meta+n',
  'meta+shift+n',
  'meta+o',
  'meta+shift+t',
  'meta+w',
  'meta+shift+w',
  'meta+q',
  'meta+1',
  'meta+2',
  'meta+3',
  'meta+4',
  'meta+5',
  'meta+6',
  'meta+7',
  'meta+8',
  'meta+9',
  'meta+tab',
  'meta+shift+tab',
  'meta+left',
  'meta+right',
  'meta+r',
  'meta+shift+r',
  'meta+l',
  'meta+f',
  'meta+g',
  'meta+shift+g',
  'meta+Option+f',
  'meta+Option+g',
  'meta+d',
  'meta+shift+d',
  'meta+s',
  'meta+p',
  'meta+Option+i',
  'meta+u',
  'meta++',
  'meta+-',
  'meta+0',
  'meta+a',
  'meta+c',
  'meta+v',
  'meta+x',
  'meta+z',
  'meta+shift+Z',
  'meta+b',
  'meta+i',
]

const KOREAN_TO_ENGLISH = {
  ㄱ: 'r',
  ㄴ: 's',
  ㄷ: 'e',
  ㄹ: 'f',
  ㅁ: 'a',
  ㅂ: 'q',
  ㅅ: 't',
  ㅇ: 'd',
  ㅈ: 'w',
  ㅊ: 'c',
  ㅋ: 'z',
  ㅌ: 'x',
  ㅍ: 'v',
  ㅎ: 'g',
  ㅏ: 'k',
  ㅑ: 'i',
  ㅓ: 'j',
  ㅕ: 'u',
  ㅗ: 'h',
  ㅛ: 'y',
  ㅜ: 'n',
  ㅠ: 'b',
  ㅡ: 'm',
  ㅣ: 'l',
  ㅐ: 'o',
  ㅒ: 'O',
  ㅔ: 'p',
  ㅖ: 'P',
  ㅢ: 'ml',
  ㅚ: 'hl',
  ㅘ: 'hk',
  ㅝ: 'nj',
  ㅟ: 'nl',
  ㅙ: 'ho',
  ㅞ: 'np',
}

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

  const handleShortcutChange = useCallback((keyboardEvent: KeyboardEvent) => {
    keyboardEvent.preventDefault()
    const { ctrlKey, metaKey, altKey, shiftKey, key } = keyboardEvent

    if (key === 'Escape') {
      handleCancel()
      return
    }

    if (key.length === 1 || ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(key)) {
      let processedKey = key.toLowerCase()

      if (KOREAN_TO_ENGLISH[processedKey]) {
        processedKey = KOREAN_TO_ENGLISH[processedKey]
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

  useHotkeys('*', handleShortcutChange, {
    enabled: isEditing,
  })

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

  const handleCancel = () => {
    reset()
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [])

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
                onClick={handleCancel}
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
