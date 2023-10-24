import { useEffect, useState } from 'react'

import type { Contents } from '@/types'

import { getActivities, getAssignmentSubmitted, getCourses, getVideoSubmitted } from '@/services'

type Options = {
  enabled?: boolean
  refreshTime?: number
}

const useGetContents = (options: Options) => {
  const _options = {
    enabled: true,
    refreshTime: 1000 * 60 * 20, // 20분
    ...options,
  }

  const [isLoading, setIsLoading] = useState(false)
  const [pos, setPos] = useState(0)
  const [data, setData] = useState<Contents>({
    courseList: [{ id: '-1', title: '전체' }],
    activityList: [],
    updateAt: new Date().toISOString(),
  })

  const getData = async () => {
    const courses = await getCourses()
    const maxPos = courses.length * 2
    let curPos = 0

    const activities = await Promise.all(
      courses.map(async course => {
        const assignmentSubmittedArray = await getAssignmentSubmitted(course.id)
        setPos((++curPos / maxPos) * 100)
        const videoSubmittedArray = await getVideoSubmitted(course.id)
        setPos((++curPos / maxPos) * 100)
        return getActivities(course.title, course.id, assignmentSubmittedArray, videoSubmittedArray)
      }),
    ).then(activities => activities.flat())

    const updateAt = new Date().toISOString()

    chrome.storage.local.set({
      courses,
      activities,
      updateAt,
    })

    setData({
      courseList: [{ id: '-1', title: '전체' }, ...courses],
      activityList: activities,
      updateAt,
    })
    setPos(0)
    setIsLoading(false)
  }

  const getLocalData = () => {
    chrome.storage.local.get(({ updateAt, courses, activities }) => {
      if (!updateAt || !courses || !activities) {
        setIsLoading(true)
        return getData()
      }

      setData({
        courseList: [{ id: '-1', title: '전체' }, ...courses],
        activityList: activities,
        updateAt,
      })
    })

    setPos(0)
    setIsLoading(false)
  }

  const refetch = () => {
    if (isLoading) return
    setIsLoading(true)
    getData()
  }

  useEffect(() => {
    if (isLoading) return

    if (_options.enabled) {
      if (_options.refreshTime < new Date().getTime() - new Date(data.updateAt).getTime()) {
        refetch()
      } else {
        getLocalData()
      }
    }
  }, [_options.enabled])

  useEffect(() => {
    getLocalData()
  }, [])

  return { data, pos, isLoading, refetch }
}

export default useGetContents
