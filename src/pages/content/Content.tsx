import courseApi from '@apis/course';
import AssignmentItem from '@components/domains/AssignmentItem';
import Filter from '@components/uis/Filter';
import Modal from '@components/uis/Modal';
import Portal from '@helpers/portal';
import { Suspense, useEffect, useState } from 'react';
import dummyData from 'src/data/dummyData';
import { generateNewElement, getLinkId } from 'src/utils';

import type { Assignment, Course } from 'src/types';

export default function Content() {
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', name: '전체', professor: '' },
  ]);
  const [assignmentList, setAssignmentList] = useState<Assignment[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<'마감일 순' | '최신 순'>('마감일 순');
  const [currentTaskStatus, setCurrentTaskStatus] = useState<'진행 중인 과제' | '모든 과제'>(
    '진행 중인 과제',
  );
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      getCourseList();
      return;
    }

    setCourseList(dummyData);
    setSelectedCourse(dummyData[0]);
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
                <Filter value={currentTaskStatus} onChange={setCurrentTaskStatus}>
                  <Filter.Header name={currentTaskStatus} />
                  <Filter.Modal>
                    <Filter.Item item="진행 중인 과제">진행 중인 과제</Filter.Item>
                    <Filter.Item item="모든 과제">모든 과제</Filter.Item>
                  </Filter.Modal>
                </Filter>
                <Filter value={sortType} onChange={setSortType}>
                  <Filter.Header name={sortType} />
                  <Filter.Modal>
                    <Filter.Item item="마감일 순">마감일 순</Filter.Item>
                    <Filter.Item item="최신 순">최신 순</Filter.Item>
                  </Filter.Modal>
                </Filter>
              </div>
            </div>
            <div className="flex flex-col gap-2 h-[300px] mt-4 overflow-hidden overflow-y-scroll">
              {selectedCourse.id === '-1' &&
                assignmentList
                  .filter(assignment => {
                    if (currentTaskStatus === '진행 중인 과제') {
                      return new Date(assignment.deadline).getTime() > new Date().getTime();
                    }
                    return true;
                  })
                  .sort((a, b) => {
                    if (sortType === '마감일 순') {
                      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                    }
                    return Number(b.id) - Number(a.id);
                  })
                  .map(assignment => (
                    <AssignmentItem
                      key={assignment.id}
                      assignment={assignment}
                      courseName={selectedCourse.name}
                    />
                  ))}
              {assignmentList
                .filter(assignment => assignment.courseId === selectedCourse.id)
                .map(assignment => (
                  <AssignmentItem
                    key={assignment.id}
                    assignment={assignment}
                    courseName={selectedCourse.name}
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
