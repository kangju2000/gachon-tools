import { forwardRef, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import type { Assignment, Course } from '@/types';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import AssignmentList from '@/components/domains/AssignmentList';
import Filter from '@/components/uis/Filter';
import Modal from '@/components/uis/Modal';
import { getActivities, getCourses } from '@/services';

const sort = [
  { id: 1, title: '마감일 순' },
  { id: 2, title: '최신 순' },
];

const status = [
  { id: 1, title: '진행중인 과제' },
  { id: 2, title: '모든 과제' },
];

type Props = {
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
};

const ContentModal = ({ isOpen, onClick }: Props, ref: React.Ref<HTMLDivElement>) => {
  const [assignmentList, setAssignmentList] = useState<Assignment[] | null>(null);
  const [courseList, setCourseList] = useState<Course[]>([
    { id: '-1', title: '전체', professor: '' },
  ]);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [sortType, setSortType] = useState<{ id: number; title: string }>(sort[0]);
  const [statusType, setStatusType] = useState<{ id: number; title: string }>(status[0]);
  const [isRefresh, setIsRefresh] = useState(true);

  const getData = async () => {
    const courses = await getCourses();
    const activities = await Promise.all(courses.map(course => getActivities(course.id)));

    setCourseList(prev => [...prev, ...courses]);
    setAssignmentList(
      activities.reduce((list, activity) => {
        return [...list, ...activity.assign];
      }, []),
    );
    setIsRefresh(false);
  };

  useEffect(() => {
    if (!isRefresh) return;
    getData();
  }, [isRefresh]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  return (
    <Modal.Background
      className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-[1999]"
      isOpen={isOpen}
      onClick={onClick}
      ref={ref}
    >
      <Modal className="fixed bottom-1/2 left-1/2 translate-x-[-50%] translate-y-1/2 flex flex-col w-[770px] h-[500px] min-w-[500px]  px-[60px] py-[50px] rounded-[36px] shadow-modal-lg">
        <div className="flex justify-between items-center text-[#0E0D46]">
          <Filter
            value={selectedCourse}
            onChange={setSelectedCourse}
            hasBorder={false}
            maxWidth="300px"
          >
            <Filter.Header className="text-[18px] font-bold" />
            <Filter.Modal pos="left">
              {courseList.map(course => (
                <Filter.Item key={course.id} item={course} />
              ))}
            </Filter.Modal>
          </Filter>
          <div className="flex gap-[16px]">
            <Filter value={sortType} onChange={setSortType}>
              <Filter.Header />
              <Filter.Modal>
                {sort.map(item => (
                  <Filter.Item key={item.id} item={item} />
                ))}
              </Filter.Modal>
            </Filter>
            <Filter value={statusType} onChange={setStatusType}>
              <Filter.Header />
              <Filter.Modal>
                {status.map(item => (
                  <Filter.Item key={item.id} item={item} />
                ))}
              </Filter.Modal>
            </Filter>
          </div>
        </div>
        {isRefresh ? (
          <div className="flex justify-center items-center flex-grow">
            <p className="text-gray-400">잠시만 기다려주세요 :)</p>
          </div>
        ) : (
          <AssignmentList
            assignmentList={assignmentList}
            courseList={courseList}
            selectedCourseId={selectedCourse.id}
            sortType={sortType.title}
            statusType={statusType.title}
          />
        )}
        <div className="flex justify-end items-center mt-5">
          <RefreshIcon
            onClick={() => setIsRefresh(true)}
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
