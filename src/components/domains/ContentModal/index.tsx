import { forwardRef, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import type { ActivityType, Course } from '@/types';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import ActivityList from '@/components/domains/ActivityList';
import Filter from '@/components/uis/Filter';
import Modal from '@/components/uis/Modal';
import ProgressBar from '@/components/uis/ProgressBar';
import { REFRESH_TIME } from '@/constants';
import useError from '@/hooks/useError';
import useScrollLock from '@/hooks/useScrollLock';
import { getActivities, getCourses } from '@/services';
import { allProgress } from '@/utils';

const status = [
  { id: 1, title: '진행중인 과제' },
  { id: 2, title: '모든 과제' },
];

type Props = {
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
};

const ContentModal = ({ isOpen, onClick }: Props, ref: React.Ref<HTMLDivElement>) => {
  const [courseList, setCourseList] = useState<Course[]>([{ id: '-1', title: '전체' }]);
  const [activityList, setActivityList] = useState<ActivityType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0]);
  const [statusType, setStatusType] = useState<{ id: number; title: string }>(status[0]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [updateAt, setUpdateAt] = useState(0);
  const [pos, setPos] = useState(0);
  const setError = useError();
  const { scrollLock, scrollUnlock } = useScrollLock();

  const getData = async () => {
    const courses = await getCourses();
    const activities = await allProgress(
      courses.map(course => getActivities(course.id)),
      progress => setPos(progress),
    ).then(activities => activities.flat());

    const updateAt = new Date().getTime();
    setCourseList([{ id: '-1', title: '전체' }, ...courses]);
    setActivityList(activities);
    setUpdateAt(updateAt);

    setTimeout(() => {
      setIsRefresh(false);
      setPos(0);

      chrome.storage.local.set({
        updateAt,
        courses,
        activities,
      });
    }, 500);
  };

  useEffect(() => {
    if (!isRefresh) return;
    getData().catch(error => setError(error));
  }, [isRefresh]);

  useEffect(() => {
    if (!isOpen) return;

    scrollLock();

    chrome.storage.local.get(
      ['updateAt', 'courses', 'activities'],
      ({ updateAt, courses, activities }) => {
        if (!updateAt || !courses || !activities) return setIsRefresh(true);

        const diff = new Date().getTime() - updateAt;
        const isOverRefreshTime = diff > REFRESH_TIME;

        if (!isOverRefreshTime) {
          setCourseList([{ id: '-1', title: '전체' }, ...courses]);
          setActivityList(activities);
          setUpdateAt(updateAt);
          setIsRefresh(false);
        } else {
          setIsRefresh(true);
        }
      },
    );

    return scrollUnlock;
  }, [isOpen]);

  return (
    <Modal.Background
      className="fixed left-0 top-0 z-[1999] h-screen w-screen bg-[rgba(0,0,0,0.5)]"
      isOpen={isOpen}
      onClick={onClick}
      ref={ref}
    >
      <Modal className="fixed bottom-1/2 left-1/2 flex h-[500px] w-[770px] min-w-[500px] translate-x-[-50%] translate-y-1/2 flex-col rounded-[36px]  bg-white px-[60px] py-[50px] shadow-modal-lg">
        <div className="flex items-center justify-between text-[#0E0D46]">
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
          <div className="flex flex-grow flex-col items-center justify-center gap-2">
            <p className="opacity-700">잠시만 기다려주세요 :)</p>
            <ProgressBar pos={pos} />
          </div>
        ) : (
          <ActivityList
            activityList={activityList}
            courseList={courseList}
            selectedCourseId={selectedCourse.id}
            statusType={statusType.title}
          />
        )}
        <div className="mt-5 flex items-center justify-end opacity-70">
          <p className="text-[12px]">
            {isRefresh
              ? '업데이트 중...'
              : `마지막 업데이트: ${new Date(updateAt).toLocaleString()}`}
          </p>
          <RefreshIcon
            onClick={() => setIsRefresh(true)}
            className="ml-[5px] cursor-pointer"
            data-tooltip-id="refresh"
            width={16}
            height={16}
          />
          <Tooltip id="refresh">새로고침</Tooltip>
        </div>
      </Modal>
    </Modal.Background>
  );
};

export default forwardRef(ContentModal);
