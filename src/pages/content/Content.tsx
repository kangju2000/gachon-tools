import courseApi from '@apis/course';
import AssignmentItem from '@components/domains/AssignmentItem';
import Filter from '@components/uis/Filter';
import Modal from '@components/uis/Modal';
import Portal from '@helpers/portal';
import { Suspense, useEffect, useState } from 'react';
import { assignmentData, courseData } from 'src/data/dummyData';
import { generateNewElement, getLinkId, pipe } from 'src/utils';

import type { Assignment, Course } from 'src/types';

export default function Content() {
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', name: '전체', professor: '' },
  ]);
  const [assignmentList, setAssignmentList] = useState<Assignment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<'마감일 순' | '최신 순'>('마감일 순');
  const [StatusType, setStatusType] = useState<'진행중인 과제' | '모든 과제'>('진행중인 과제');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCourseElements = async (idList: string[]) => {
    const courseElements = await Promise.all(
      idList.map(async id => {
        const { data } = await courseApi.getCourseById(id);
        const element = generateNewElement(data);
        return element;
      }),
    );

    return courseElements;
  };

  const getAssignments = (element: HTMLElement, courseId: string) => {
    const assignmentLink = element.querySelectorAll('td.cell.c1 > a');
    const deadline = element.getElementsByClassName('cell c2');
    const isDone = element.getElementsByClassName('cell c3');

    const assignments: Assignment[] = Array.from({
      length: assignmentLink.length,
    }).reduce<Assignment[]>(
      (acc, _, i) => [
        ...acc,
        {
          id: getLinkId((assignmentLink[i] as HTMLAnchorElement).href),
          courseId,
          title: assignmentLink[i].textContent,
          link: (assignmentLink[i] as HTMLAnchorElement).href,
          deadline: deadline[i].textContent,
          isDone:
            isDone[i].textContent === '제출 완료' ||
            isDone[i].textContent === 'Submitted for grading',
        },
      ],
      [],
    );

    return assignments;
  };

  const getCourseList = async () => {
    const professorElements = document.getElementsByClassName('prof');
    const courseLinkElements = document.getElementsByClassName('course_link');

    const professorList = Array.from(professorElements).map(element => element.textContent);
    const courseIdList = Array.from(courseLinkElements).map(element =>
      getLinkId((element as HTMLAnchorElement).href),
    );

    const courseElements = await getCourseElements(courseIdList);

    const courseArray = courseElements.reduce<Course[]>((acc, courseElement, i) => {
      const id = courseIdList[i];
      const name = courseElement.getElementsByClassName('breadcrumb')[0].textContent;
      const professor = professorList[i];

      return [...acc, { id, name, professor }];
    }, []);

    const assignmentArray = courseElements.reduce<Assignment[]>((acc, courseElement, i) => {
      const assignments = getAssignments(courseElement, courseIdList[i]);
      return [...acc, ...assignments];
    }, []);

    setCourseList(prev => [...prev, ...courseArray]);
    setAssignmentList(assignmentArray);
  };

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

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      getCourseList();
      return;
    }

    setCourseList(courseData);
    setAssignmentList(assignmentData);
  }, []);

  return (
    <>
      <Portal elementId="modal">
        <Modal
          isOpen={isModalOpen}
          className="fixed bottom-28 left-1/2 translate-x-[-50%] w-[770px] h-[500px] p-[60px] shadow-modal-lg"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex justify-between items-center">
              <Filter
                value={selectedCourse}
                onChange={setSelectedCourse}
                hasBorder={false}
                maxWidth="300px"
              >
                <Filter.Header className="text-[18px] font-bold" name={selectedCourse.name} />
                <Filter.Modal pos="left">
                  {courseList.map(course => (
                    <Filter.Item key={course.id} item={course}>
                      {course.name}
                    </Filter.Item>
                  ))}
                </Filter.Modal>
              </Filter>
              <div className="flex gap-[16px]">
                <Filter value={sortType} onChange={setSortType}>
                  <Filter.Header name={sortType} />
                  <Filter.Modal>
                    <Filter.Item item="마감일 순">마감일 순</Filter.Item>
                    <Filter.Item item="최신 순">최신 순</Filter.Item>
                  </Filter.Modal>
                </Filter>
                <Filter value={StatusType} onChange={setStatusType}>
                  <Filter.Header name={StatusType} />
                  <Filter.Modal>
                    <Filter.Item item="진행중인 과제">진행중인 과제</Filter.Item>
                    <Filter.Item item="모든 과제">모든 과제</Filter.Item>
                  </Filter.Modal>
                </Filter>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 h-[300px] mt-4 overflow-hidden overflow-y-scroll">
              {pipe(
                assignmentList,
                assignmentList => filterAssignmentList(assignmentList, selectedCourse.id),
                assignmentList => sortAssignmentList(assignmentList, sortType),
                assignmentList => filterAssignmentStatus(assignmentList, StatusType),
              ).map(assignment => (
                <AssignmentItem
                  key={assignment.id}
                  assignment={assignment}
                  courseName={courseList.find(course => course.id === assignment.courseId).name}
                />
              ))}
            </div>
          </Suspense>
        </Modal>
      </Portal>
      <div
        className="w-[40px] h-[40px] rounded-[50px] bg-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></div>
    </>
  );
}
