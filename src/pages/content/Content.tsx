import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Assignment, Course } from '@/types';

import ContentModal from '@/components/domains/ContentModal';
import { assignmentData, courseData } from '@/data/dummyData';
import Portal from '@/helpers/portal';
import { getActivities, getCourses } from '@/services';

export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentList, setAssignmentList] = useState<Assignment[] | null>(null);
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', title: '전체', professor: '' },
  ]);

  const modalRef = useRef();
  const handleRefresh = () => {
    if (assignmentList === null) return;
    setAssignmentList(null);
    setCourseList([{ id: '-1', title: '전체', professor: '' }]);

    getCourses().then(courseList => {
      setCourseList(prev => [...prev, ...courseList]);
      courseList.forEach(course => {
        getActivities(course.id).then(({ assign }) => {
          setAssignmentList(prev => {
            if (prev === null) return assign;
            return [...prev, ...assign];
          });
        });
      });
    });
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setCourseList(prev => [...prev, ...courseData]);
      setAssignmentList(assignmentData);
      return;
    }

    getCourses().then(courseList => {
      setCourseList(prev => [...prev, ...courseList]);
      courseList.forEach(course => {
        getActivities(course.id).then(({ assign }) => {
          setAssignmentList(prev => {
            if (prev === null) return assign;
            return [...prev, ...assign];
          });
        });
      });
    });
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
