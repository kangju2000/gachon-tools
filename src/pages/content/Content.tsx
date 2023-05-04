import courseApi from '@apis/course';
import AssignmentFilter from '@components/domains/AssignmentFilter';
import AssignmentList from '@components/domains/AssignmentList';
import Modal from '@components/uis/Modal';
import Portal from '@helpers/portal';
import { useEffect, useRef, useState } from 'react';
import { assignmentData, courseData } from 'src/data/dummyData';
import { generateNewElement, getLinkId } from 'src/utils';

import type { Assignment, Course } from 'src/types';

export default function Content() {
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', name: '전체', professor: '' },
  ]);
  const [assignmentList, setAssignmentList] = useState<Assignment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<'마감일 순' | '최신 순'>('마감일 순');
  const [statusType, setStatusType] = useState<'진행중인 과제' | '모든 과제'>('진행중인 과제');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef();

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
    const assignmentLinkElements = element.querySelectorAll('td.cell.c1 > a');
    const deadlineElements = element.getElementsByClassName('cell c2');
    const isDoneElements = element.getElementsByClassName('cell c3');

    const assignments: Assignment[] = [...assignmentLinkElements].reduce<Assignment[]>(
      (acc, _, i) => [
        ...acc,
        {
          id: getLinkId((assignmentLinkElements[i] as HTMLAnchorElement).href),
          courseId,
          title: assignmentLinkElements[i].textContent,
          link: (assignmentLinkElements[i] as HTMLAnchorElement).href,
          deadline: deadlineElements[i].textContent,
          isDone:
            isDoneElements[i].textContent === '제출 완료' ||
            isDoneElements[i].textContent === 'Submitted for grading',
        },
      ],
      [],
    );

    return assignments;
  };

  const getCourseList = async () => {
    const professorElements = document.getElementsByClassName('prof');
    const courseLinkElements = document.getElementsByClassName('course_link');

    const professorList = [...professorElements].map(element => element.textContent);
    const courseIdList = [...courseLinkElements].map(element =>
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

    setCourseList(courseData);
    setAssignmentList(assignmentData);
  }, []);

  return (
    <>
      <Portal elementId="modal">
        <Modal.Background
          isOpen={isModalOpen}
          onClick={event => {
            if (event.target == modalRef.current) setIsModalOpen(false);
          }}
          ref={modalRef}
        >
          <Modal
            isOpen={isModalOpen}
            className="fixed bottom-28 left-1/2 translate-x-[-50%] w-[770px] h-[500px] p-[60px] shadow-modal-lg"
          >
            <AssignmentFilter
              courseList={courseList}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              sortType={sortType}
              setSortType={setSortType}
              statusType={statusType}
              setStatusType={setStatusType}
            />
            <AssignmentList
              assignmentList={assignmentList}
              courseList={courseList}
              selectedCourseId={selectedCourse.id}
              sortType={sortType}
              statusType={statusType}
            />
          </Modal>
        </Modal.Background>
      </Portal>
      <div
        className="w-[40px] h-[40px] rounded-[50px] bg-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></div>
    </>
  );
}
