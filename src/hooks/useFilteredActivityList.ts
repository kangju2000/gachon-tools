import { isValid } from 'date-fns'

import { TAB_LIST } from '@/constants'
import type { ActivityType } from '@/types'
import { pipe } from '@/utils'

const activityListByCourse = (activityList: ActivityType[], id: string) => {
  if (id === '-1') {
    return activityList
  }

  return activityList.filter(activity => activity.courseId === id)
}

const sortActivityList = (activityList: ActivityType[]) => {
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

const activityListByTabIndex = (activityList: ActivityType[], tabIndex: number) => {
  if (TAB_LIST[tabIndex] === TAB_LIST[0]) {
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

const useFilteredActivityList = (
  activityList: ActivityType[],
  selectedCourseId: string,
  tabIndex: number,
  isChecked: boolean,
) => {
  return pipe(
    activityList,
    activityList => activityListByCourse(activityList, selectedCourseId),
    activityList => sortActivityList(activityList),
    activityList => activityListByTabIndex(activityList, tabIndex),
    activityList => activityListBySubmitted(activityList, isChecked),
  )
}

export default useFilteredActivityList
