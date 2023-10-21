import { useEffect, useState } from 'react'

import type { Contents } from '@/types'

import { getActivities, getCourses } from '@/services'
import { allProgress } from '@/utils'

const useGetContents = (
  options: { local?: boolean; enabled?: boolean } = { local: false, enabled: true },
) => {
  const [pos, setPos] = useState(0)
  const [data, setData] = useState<Contents>({
    courseList: [{ id: '-1', title: '전체' }],
    activityList: [],
    updateAt: 0,
  })

  const getData = async () => {
    const courses = await getCourses()
    const activities = await allProgress(
      courses.map(course => getActivities(course.title, course.id)),
      progress => setPos(progress),
    ).then(activities => activities.flat())

    const updateAt = new Date().getTime()

    setData({
      courseList: [{ id: '-1', title: '전체' }, ...courses],
      activityList: activities,
      updateAt,
    })

    setPos(0)

    chrome.storage.local.set({
      courses,
      activities,
      updateAt,
    })
  }

  const getLocalData = () => {
    chrome.storage.local.get(({ updateAt, courses, activities }) => {
      setData({
        courseList: [{ id: '-1', title: '전체' }, ...courses],
        activityList: activities,
        updateAt,
      })
    })
  }

  useEffect(() => {
    if (options.enabled) {
      options.local ? getLocalData() : getData()
    }
  }, [options.enabled])

  return { data, pos }
}

export default useGetContents
