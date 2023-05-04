import { Assignment, Course } from 'src/types';
import { pipe } from 'src/utils';

import AssignmentItem from '../AssignmentItem';

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
  const filterAssignmentList = (assignmentList: Assignment[], courseId: string) => {
    if (courseId === '-1') {
      return assignmentList;
    }

    return assignmentList.filter(assignment => assignment.courseId === courseId);
  };

  const sortAssignmentList = (assignmentList: Assignment[], type: string) => {
    if (type === '마감일 순') {
      return assignmentList.sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      );
    }

    return assignmentList.sort((a, b) => Number(b.id) - Number(a.id));
  };

  const filterAssignmentStatus = (assignmentList: Assignment[], type: string) => {
    if (type === '진행중인 과제') {
      return assignmentList.filter(
        assignment => new Date(assignment.deadline).getTime() > new Date().getTime(),
      );
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
      <div className="flex flex-col items-center gap-2 h-[300px] mt-4 p-[5px] overflow-hidden overflow-y-scroll">
        <p className="text-gray-400">과제가 없습니다.</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-2 h-[300px] mt-4 p-[5px] overflow-hidden overflow-y-scroll">
      {filteredAssignmentList.map(assignment => (
        <AssignmentItem
          key={assignment.id}
          assignment={assignment}
          courseName={courseList.find(course => course.id === assignment.courseId).name}
        />
      ))}
    </div>
  );
};

export default AssignmentList;
