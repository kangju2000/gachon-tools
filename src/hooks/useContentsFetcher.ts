import { useState } from 'react'

import { useStorage } from '@/context/storageContext'
import { getActivities, getAssignmentSubmitted, getCourses, getVideoSubmitted } from '@/services'

export const useContentsFetcher = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { data, updateData } = useStorage()

  const fetchContents = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setProgress(0)

    const courseList = await getCourses()
    const maxPos = courseList.length * 2

    const activityList = await Promise.all(
      courseList.map(async (course, index) => {
        const assignmentSubmittedArray = await getAssignmentSubmitted(course.id)
        setProgress(((index * 2 + 1) / maxPos) * 100)
        const videoSubmittedArray = await getVideoSubmitted(course.id)
        setProgress(((index * 2 + 2) / maxPos) * 100)
        return getActivities(course.title, course.id, assignmentSubmittedArray, videoSubmittedArray)
      }),
    ).then(activityList => activityList.flat())

    updateData({
      contents: { courseList: [{ id: '-1', title: '전체' }, ...courseList], activityList },
      meta: { ...data.meta, updateAt: new Date().toISOString() },
    })

    setIsLoading(false)
    setProgress(0)
  }

  return { fetchContents, isLoading, progress }
}
