import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import { pxToRemMap } from '@/styles'

import type { ClassValue } from 'clsx'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': Object.keys(pxToRemMap).map(key => `text-${key}`),
      'border-w': Object.keys(pxToRemMap).map(key => `border-${key}`),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
