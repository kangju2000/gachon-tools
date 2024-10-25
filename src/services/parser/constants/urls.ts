export const URL_PATTERNS = {
  courses: '/local/ubion/user',
  coursesWithYearSemester: (year: number, semester: number) =>
    `${URL_PATTERNS.courses}?year=${year}&semester=${semester}`,
  activities: (courseId: string) => `/course/view.php?id=${courseId}`,
  assignmentSubmitted: (courseId: string) => `/mod/assign/index.php?id=${courseId}`,
  videoSubmitted: (courseId: string) => `/report/ubcompletion/user_progress.php?id=${courseId}`,
} as const

export type URLPatterns = typeof URL_PATTERNS
