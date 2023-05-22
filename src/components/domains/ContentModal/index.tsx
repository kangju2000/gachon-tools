import { forwardRef, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import type { Course } from '@/types';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import ActivityList from '@/components/domains/ActivityList';
import useFetchData from '@/components/domains/ContentModal/hooks/useFetchData';
import Filter from '@/components/uis/Filter';
import FlexCenterDiv from '@/components/uis/FlexCenterDiv';
import Modal from '@/components/uis/Modal';
import ProgressBar from '@/components/uis/ProgressBar';
import { REFRESH_TIME } from '@/constants';
import useError from '@/hooks/useError';
import useScrollLock from '@/hooks/useScrollLock';
import filteredActivities from '@/utils/filteredActivityList';

const status = [
  { id: 1, title: '진행중인 과제' },
  { id: 2, title: '모든 과제' },
];

type Props = {
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
};

const ContentModal = ({ isOpen, onClick }: Props, ref: React.Ref<HTMLDivElement>) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>({ id: '-1', title: '전체' });
  const [statusType, setStatusType] = useState<{ id: number; title: string }>(status[0]);
  const [isRefresh, setIsRefresh] = useState(false);

  const { catchAsyncError } = useError();
  const { scrollLock, scrollUnlock } = useScrollLock();
  const [getData, getLocalData, data, pos] = useFetchData();

  const { courseList, activityList, updateAt } = data;
  const filteredActivityList = filteredActivities(
    activityList,
    selectedCourse.id,
    statusType.title,
  );

  useEffect(() => {
    if (!isRefresh) return;
    getData()
      .then(() => setIsRefresh(false))
      .catch(error => catchAsyncError(error));
  }, [isRefresh]);

  useEffect(() => {
    if (!isOpen) return;
    scrollLock();
    if (!isRefresh)
      chrome.storage.local.get(['updateAt'], ({ updateAt }) => {
        if (!updateAt) return setIsRefresh(true);

        const diff = new Date().getTime() - updateAt;
        const isOverRefreshTime = diff > REFRESH_TIME;

        if (!isOverRefreshTime) {
          getLocalData();
        } else {
          setIsRefresh(true);
        }
      });

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
          <FlexCenterDiv className="flex-grow flex-col gap-2">
            <p className="opacity-700">잠시만 기다려주세요 :)</p>
            <ProgressBar pos={pos} />
          </FlexCenterDiv>
        ) : (
          <ActivityList filteredActivityList={filteredActivityList} courseList={courseList} />
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
