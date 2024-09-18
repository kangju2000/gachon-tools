import { useEffect, useState } from 'react'

import { useRefreshCheck } from './useRefreshCheck'
import { getActivities, getAssignmentSubmitted, getCourses, getVideoSubmitted } from '@/services'
import { useStorageStore } from '@/storage/useStorageStore'

export const useContentsFetcher = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { updateContents, updateMeta } = useStorageStore()
  const { shouldRefresh } = useRefreshCheck()

  const fetchContents = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setProgress(0)

    const courseList = await getCourses()
    const maxPos = courseList.length * 2
    let curPos = 0

    const activityList = await Promise.all(
      courseList.map(async course => {
        const assignmentSubmittedArray = await getAssignmentSubmitted(course.id)
        setProgress((++curPos / maxPos) * 100)
        const videoSubmittedArray = await getVideoSubmitted(course.id)
        setProgress((++curPos / maxPos) * 100)
        return getActivities(course.title, course.id, assignmentSubmittedArray, videoSubmittedArray)
      }),
    ).then(activityList => activityList.flat())

    updateContents({ courseList: [{ id: '-1', title: '전체 과목' }, ...courseList], activityList })
    updateMeta({ updateAt: new Date().toISOString() })

    setIsLoading(false)
    setProgress(0)
  }

  useEffect(() => {
    if (shouldRefresh) {
      fetchContents()
    }
  }, [shouldRefresh])

  return { refetch: fetchContents, isLoading, progress }
}
