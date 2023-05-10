import { forwardRef, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import type { Assignment, Course } from '@/types';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import AssignmentFilter from '@/components/domains/AssignmentFilter';
import AssignmentList from '@/components/domains/AssignmentList';
import Modal from '@/components/uis/Modal';

type Props = {
  assignmentList: Assignment[] | null;
  courseList: Course[];
  onClick: (event: React.MouseEvent) => void;
  handleRefresh: () => void;
};

const ContentModal = (
  { assignmentList, courseList, onClick, handleRefresh }: Props,
  ref: React.Ref<HTMLDivElement>,
) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<'마감일 순' | '최신 순'>('마감일 순');
  const [statusType, setStatusType] = useState<'진행중인 과제' | '모든 과제'>('진행중인 과제');

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  return (
    <Modal.Background
      className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-[1999]"
      onClick={onClick}
      ref={ref}
    >
      <Modal className="fixed bottom-1/2 left-1/2 translate-x-[-50%] translate-y-1/2 flex flex-col w-[770px] h-[500px] min-w-[500px]  px-[60px] py-[50px] rounded-[36px] shadow-modal-lg">
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
          <RefreshIcon
            onClick={handleRefresh}
            className="cursor-pointer"
            data-tooltip-id="refresh"
          />
          <Tooltip id="refresh">새로고침</Tooltip>
        </div>
      </Modal>
    </Modal.Background>
  );
};

export default forwardRef(ContentModal);
