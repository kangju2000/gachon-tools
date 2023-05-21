import type { ActivityType } from '@/types';

import { pipe } from '@/utils';

const activityListByCourse = (activityList: ActivityType[], id: string) => {
  if (id === '-1') {
    return activityList;
  }

  return activityList.filter(activity => activity.courseId === id);
};

const sortAcitivityList = (activityList: ActivityType[]) => {
  return activityList.sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime());
};

const activityListByStatus = (activityList: ActivityType[], status: string) => {
  if (status === '진행중인 과제') {
    return activityList.filter(
      activity => new Date(activity.endAt).getTime() > new Date().getTime(),
    );
  }

  return activityList;
};

const filteredActivities = (
  activityList: ActivityType[],
  selectedCourseId: string,
  status: string,
) =>
  pipe(
    activityList,
    activityList => activityListByCourse(activityList, selectedCourseId),
    activityList => sortAcitivityList(activityList),
    activityList => activityListByStatus(activityList, status),
  );

export default filteredActivities;
