import type { University } from '@/constants/univ'

export const UNIVERSITY_REGEX: Record<University, { titleRegex: RegExp }> = {
  가천대학교: {
    titleRegex: /\((\w{5}_\w{3})\)/,
  },
  서울시립대학교: {
    titleRegex: /\[(?:\w{5}_\w{2}|\w{2})]/,
  },
} as const

export const SUBMISSION_STATUS_REGEX = /(Submitted for grading)|(제출 완료)/
