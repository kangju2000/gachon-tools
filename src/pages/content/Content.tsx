import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Assignment, Course } from '@/types';

import courseApi from '@/apis/course';
import ContentModal from '@/components/domains/ContentModal';
import { assignmentData, courseData } from '@/data/dummyData';
import Portal from '@/helpers/portal';
import { generateNewElement, getLinkId } from '@/utils';

export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentList, setAssignmentList] = useState<Assignment[] | null>(null);
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', name: '전체', professor: '' },
  ]);

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
    let element: HTMLElement = document.body;

    if (window.location.href !== 'https://cyber.gachon.ac.kr') {
      const { data } = await axios.get('https://cyber.gachon.ac.kr');
      element = generateNewElement(data);
    }
    const professorElements = element.getElementsByClassName('prof');
    const courseLinkElements = element.getElementsByClassName('course_link');

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

  return (
    <div className="fixed bottom-[25px] left-1/2 translate-x-[-50%]">
      <motion.div
        whileHover={{ width: '100px' }}
        className="w-[40px] h-[40px] rounded-[50px] bg-[#2F6EA2] shadow-md shadow-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></motion.div>
      <Portal elementId="modal">
        <ContentModal
          ref={modalRef}
          onClick={event => {
            if (event.target === modalRef.current) setIsModalOpen(false);
          }}
          isOpen={isModalOpen}
          assignmentList={assignmentList}
          courseList={courseList}
          handleRefresh={handleRefresh}
        />
      </Portal>
    </div>
  );
}
