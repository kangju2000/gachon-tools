// src/hooks/useGetContents.ts

import { useEffect, useState } from 'react'

import type { StorageData } from '@/lib/chromeStorage'
import { getAllStorageData, setStorageData, DEFAULT_SETTINGS, setStorageDataPartial } from '@/lib/chromeStorage'
import { getActivities, getAssignmentSubmitted, getCourses, getVideoSubmitted } from '@/services'
import type { Contents } from '@/types'

type Options = {
  enabled?: boolean
}

const useGetContents = (options: Options) => {
  const _options = {
    enabled: true,
    ...options,
  }

  const [isLoading, setIsLoading] = useState(false)
  const [pos, setPos] = useState(0)
  const [data, setData] = useState<Contents>({
    courseList: [{ id: '-1', title: '전체' }],
    activityList: [],
    updateAt: new Date().toISOString(),
  })
  const [settings, setSettings] = useState<StorageData['settings']>(DEFAULT_SETTINGS)

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

    await setStorageDataPartial({ courses, activities, updateAt })

    setData({
      courseList: [{ id: '-1', title: '전체' }, ...courses],
      activityList: activities,
      updateAt,
    })
    setPos(0)
    setIsLoading(false)
  }

  const getLocalData = async () => {
    const storedData = await getAllStorageData()
    const { updateAt, courses, activities, settings: storedSettings } = storedData

    if (!updateAt || !courses || !activities) {
      setIsLoading(true)
      return getData()
    }

    setData({
      courseList: [{ id: '-1', title: '전체' }, ...courses],
      activityList: activities,
      updateAt,
    })

    if (storedSettings) {
      setSettings(storedSettings)
    } else {
      await setStorageData('settings', DEFAULT_SETTINGS)
    }

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

    const lastUpdateTime = new Date(data.updateAt).getTime()
    const currentTime = new Date().getTime()
    if (currentTime - lastUpdateTime > settings.refreshTime) {
      refetch()
    } else {
      getLocalData()
    }
  }, [_options.enabled, settings.refreshTime])

  useEffect(() => {
    getLocalData()
  }, [])

  return { data, pos, isLoading, refetch, settings, setSettings }
}

export default useGetContents
