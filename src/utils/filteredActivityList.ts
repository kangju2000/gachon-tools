import { isValid } from 'date-fns'

import type { ActivityType } from '@/types'
import { pipe } from '@/utils'

const activityListByCourse = (activityList: ActivityType[], id: string) => {
  if (id === '-1') {
    return activityList
  }

  return activityList.filter(activity => activity.courseId === id)
}

const sortAcitivityList = (activityList: ActivityType[]) => {
  const [endAtList, noEndAtList] = activityList.reduce<[ActivityType[], ActivityType[]]>(
    (acc, cur) => {
      if (isValid(new Date(cur.endAt))) {
        return [[...acc[0], cur], acc[1]]
      }

      return [acc[0], [...acc[1], cur]]
    },
    [[], []],
  )

  const sortedList = endAtList.sort((a, b) => {
    return new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
  })

  return [...sortedList, ...noEndAtList]
}

const activityListByStatus = (activityList: ActivityType[], status: string) => {
  if (status === '진행중인 과제') {
    return activityList.filter(activity => {
      if (activity.endAt) return new Date(activity.endAt).getTime() > new Date().getTime()

      return true
    })
  }

  return activityList
}

const activityListBySubmitted = (activityList: ActivityType[], isChecked: boolean) => {
  if (isChecked) {
    return activityList.filter(activity => !activity.hasSubmitted)
  }
  return activityList
}

const filteredActivities = (
  activityList: ActivityType[],
  selectedCourseId: string,
  status: string,
  isChecked: boolean,
) =>
  pipe(
    activityList,
    activityList => activityListByCourse(activityList, selectedCourseId),
    activityList => sortAcitivityList(activityList),
    activityList => activityListByStatus(activityList, status),
    activityList => activityListBySubmitted(activityList, isChecked),
  )

export default filteredActivities
