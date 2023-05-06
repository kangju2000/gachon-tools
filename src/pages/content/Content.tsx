import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Assignment, Course } from '@/types';

import courseApi from '@/apis/course';
import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import AssignmentFilter from '@/components/domains/AssignmentFilter';
import AssignmentList from '@/components/domains/AssignmentList';
import Modal from '@/components/uis/Modal';
import { assignmentData, courseData } from '@/data/dummyData';
import Portal from '@/helpers/portal';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { generateNewElement, getLinkId } from '@/utils';

export default function Content() {
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', name: '전체', professor: '' },
  ]);
  const [assignmentList, setAssignmentList] = useState<Assignment[] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<'마감일 순' | '최신 순'>('마감일 순');
  const [statusType, setStatusType] = useState<'진행중인 과제' | '모든 과제'>('진행중인 과제');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { lockScroll, openScroll } = useBodyScrollLock();

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

  const handleRefresh = () => {
    if (assignmentList === null) return;
    setAssignmentList(null);
    setCourseList([{ id: '-1', name: '전체', professor: '' }]);
    getCourseList();
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setCourseList(courseData);
      setAssignmentList(assignmentData);
      return;
    }

    getCourseList();
  }, []);

  useEffect(() => (isModalOpen ? lockScroll() : openScroll()), [isModalOpen]);

  return (
    <div className="fixed bottom-[25px] left-1/2 translate-x-[-50%]">
      <motion.div
        whileHover={{ width: '100px' }}
        className="w-[40px] h-[40px] rounded-[50px] bg-[#2F6EA2] shadow-md shadow-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></motion.div>
      <Portal elementId="modal">
        <Modal.Background
          isOpen={isModalOpen}
          className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-[1999]"
          onClick={event => {
            if (event.target === modalRef.current) setIsModalOpen(false);
          }}
          ref={modalRef}
        >
          <Modal
            isOpen={isModalOpen}
            className="fixed bottom-1/2 left-1/2 translate-x-[-50%] translate-y-1/2 flex flex-col w-[770px] h-[500px] min-w-[500px]  px-[60px] py-[50px] rounded-[36px] shadow-modal-lg"
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
            {assignmentList === null ? (
              <div className="flex justify-center items-center flex-grow">
                <p className="text-gray-400">잠시만 기다려주세요 :)</p>
              </div>
            ) : (
              <AssignmentList
                assignmentList={assignmentList}
                courseList={courseList}
                selectedCourseId={selectedCourse.id}
                sortType={sortType}
                statusType={statusType}
              />
            )}
            <div className="flex justify-end items-center mt-5">
              <RefreshIcon onClick={handleRefresh} className="cursor-pointer" />
            </div>
          </Modal>
        </Modal.Background>
      </Portal>
    </div>
  );
}
