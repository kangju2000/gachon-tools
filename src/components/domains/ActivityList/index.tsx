import type { ActivityType, Course } from '@/types';

import ActivityItem from '@/components/domains/ActivityItem';
import { pipe } from '@/utils';

type Props = {
  activityList: ActivityType[];
  courseList: Course[];
  selectedCourseId: string;
  sortType: string;
  statusType: string;
};

const ActivityList = ({
  activityList,
  courseList,
  selectedCourseId,
  sortType,
  statusType,
}: Props) => {
  const filterActivityList = (activityList: ActivityType[], id: string) => {
    if (id === '-1') {
      return activityList;
    }

    return activityList.filter(activity => activity.courseId === id);
  };

  const sortAcitivityList = (activityList: ActivityType[], type: string) => {
    if (type === '마감일 순') {
      return activityList.sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime());
    }

    return activityList.sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filterActivityStatus = (activityList: ActivityType[], type: string) => {
    if (type === '진행중인 과제') {
      return activityList.filter(
        activity => new Date(activity.endAt).getTime() > new Date().getTime(),
      );
    }

    return activityList;
  };

  const filteredActivityList = pipe(
    activityList,
    activityList => filterActivityList(activityList, selectedCourseId),
    activityList => sortAcitivityList(activityList, sortType),
    activityList => filterActivityStatus(activityList, statusType),
  );

  if (!filteredActivityList.length)
    return (
      <div className="flex flex-col items-center flex-grow mt-4 p-[5px] overflow-hidden overflow-y-scroll">
        <p className="text-gray-400">과제가 없습니다.</p>
      </div>
    );

  return (
    <div
      id="activity-list"
      className="flex flex-col items-center gap-2 flex-grow min-w-[500px] mt-4 p-[5px] overflow-hidden overflow-y-scroll"
    >
      {filteredActivityList.map(activity => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          courseName={courseList.find(course => course.id === activity.courseId).title}
        />
      ))}
    </div>
  );
};

export default ActivityList;
