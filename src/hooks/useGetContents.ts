import { useEffect, useState } from 'react'

import type { Contents } from '@/types'

import { getActivities, getCourses } from '@/services'
import { allProgress } from '@/utils'

const useGetContents = (
  options: { local?: boolean; enabled?: boolean } = { local: false, enabled: true },
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pos, setPos] = useState(0)
  const [data, setData] = useState<Contents>({
    courseList: [{ id: '-1', title: '전체' }],
    activityList: [],
    updateAt: new Date().toISOString(),
  })

  const getData = async () => {
    const courses = await getCourses()
    const activities = await allProgress(
      courses.map(course => getActivities(course.title, course.id)),
      progress => setPos(progress),
    )
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
    setIsLoading(true)
    getData()
  }

  useEffect(() => {
    if (options.enabled) {
      setIsLoading(true)
      options.local ? getLocalData() : getData()
    }
  }, [options.enabled])

  return { data, pos, isLoading, refetch }
}

export default useGetContents
