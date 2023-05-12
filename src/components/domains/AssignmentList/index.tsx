import type { Assignment, Course } from '@/types';

import AssignmentItem from '@/components/domains/AssignmentItem';
import { pipe } from '@/utils';

type Props = {
  assignmentList: Assignment[];
  courseList: Course[];
  selectedCourseId: string;
  sortType: string;
  statusType: string;
};

const AssignmentList = ({
  assignmentList,
  courseList,
  selectedCourseId,
  sortType,
  statusType,
}: Props) => {
  const filterAssignmentList = (assignmentList: Assignment[], id: string) => {
    if (id === '-1') {
      return assignmentList;
    }

    return assignmentList.filter(assignment => assignment.courseId === id);
  };

  const sortAssignmentList = (assignmentList: Assignment[], type: string) => {
    if (type === '마감일 순') {
      return assignmentList.sort((a, b) => a.endAt.getTime() - b.endAt.getTime());
    }

    return assignmentList.sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filterAssignmentStatus = (assignmentList: Assignment[], type: string) => {
    if (type === '진행중인 과제') {
      return assignmentList.filter(assignment => assignment.endAt.getTime() > new Date().getTime());
    }

    return assignmentList;
  };

  const filteredAssignmentList = pipe(
    assignmentList,
    assignmentList => filterAssignmentList(assignmentList, selectedCourseId),
    assignmentList => sortAssignmentList(assignmentList, sortType),
    assignmentList => filterAssignmentStatus(assignmentList, statusType),
  );

  if (!filteredAssignmentList.length)
    return (
      <div className="flex flex-col items-center flex-grow mt-4 p-[5px] overflow-hidden overflow-y-scroll">
        <p className="text-gray-400">과제가 없습니다.</p>
      </div>
    );

  return (
    <div
      id="assignment-list"
      className="flex flex-col items-center gap-2 flex-grow min-w-[500px] mt-4 p-[5px] overflow-hidden overflow-y-scroll"
    >
      {filteredAssignmentList.map(assignment => (
        <AssignmentItem
          key={assignment.id}
          assignment={assignment}
          courseName={courseList.find(course => course.id === assignment.courseId).title}
        />
      ))}
    </div>
  );
};

export default AssignmentList;
