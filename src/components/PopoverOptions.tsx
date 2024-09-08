import React, { useState } from 'react'

import Popover from './Popover'
import packageJson from '../../package.json'

const { version } = packageJson

type Props = {
  triggerElement: React.ReactNode
}

const PopoverOptions: React.FC<Props> = ({ triggerElement }) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (window.localStorage.getItem('color-theme') as 'light' | 'dark') || 'light'
    }
    return 'light'
  })

  const toggleColorMode = (mode: 'light' | 'dark') => {
    setColorMode(mode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('color-theme', mode)
      if (mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const popoverContent = (
    <>
      <h3 className="mb-2 text-14px font-bold text-gray-700 dark:text-gray-200">설정</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-12px text-gray-600 dark:text-gray-400">테마 :</span>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={colorMode === 'light'}
              onChange={() => toggleColorMode('light')}
            />
            <span className="ml-2 text-12px text-gray-700 dark:text-gray-300">Light</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={colorMode === 'dark'}
              onChange={() => toggleColorMode('dark')}
            />
            <span className="ml-2 text-12px text-gray-700 dark:text-gray-300">Dark</span>
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-12px text-gray-600 dark:text-gray-400">단축키 :</span>
          <span className="text-12px text-gray-700 dark:text-gray-300">
            <kbd className="rounded-4px border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
            </kbd>
            {' + '}
            <kbd className="rounded-4px border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">
              /
            </kbd>
          </span>
        </div>
      </div>
      <div className="mt-4 text-right">
        <span className="text-12px text-gray-500">ver.{version}</span>
      </div>
    </>
  )

  return <Popover trigger={triggerElement} content={popoverContent} contentClassName="w-64 p-4" />
}

export default PopoverOptions
