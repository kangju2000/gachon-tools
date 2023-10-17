import type { ActivityType, Course } from '@/types'

import ActivityItem from '@/components/domains/ActivityItem'
import FlexCenterDiv from '@/components/uis/FlexCenterDiv'

type Props = {
  filteredActivityList: ActivityType[]
  courseList: Course[]
}

const ActivityList = ({ filteredActivityList, courseList }: Props) => {
  if (!filteredActivityList.length)
    return (
      <FlexCenterDiv className="mt-4 flex-grow p-[5px]">
        <p className="text-gray-400">과제가 없습니다.</p>
      </FlexCenterDiv>
    )

  return (
    <div
      id="activity-list"
      className="mt-4 flex min-w-[500px] flex-grow flex-col items-center gap-2 overflow-hidden overflow-y-scroll p-[5px]"
    >
      {filteredActivityList.map(activity => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          courseName={courseList.find(course => course.id === activity.courseId).title}
        />
      ))}
    </div>
  )
}

export default ActivityList
