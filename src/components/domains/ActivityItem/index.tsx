import { captureException } from '@sentry/react';

import type { ActivityType } from '@/types';

import { ReactComponent as CheckIcon } from '@/assets/circle_check.svg';
import { ReactComponent as XMarkIcon } from '@/assets/circle_x.svg';
import { ReactComponent as StopwatchIcon } from '@/assets/stopwatch.svg';
import ActivityTag from '@/components/domains/ActivityTag';
import { convertDateTime, timeFormat } from '@/utils';

type Props = {
  activity: ActivityType;
  courseName: string;
};

const Icon = ({ type }: { type: 'check' | 'x' | 'stopwatch' }) =>
  ({
    check: <CheckIcon width={38} height={38} />,
    x: <XMarkIcon width={38} height={38} />,
    stopwatch: <StopwatchIcon width={38} height={38} />,
  }[type]);

const ActivityItem = ({ activity, courseName }: Props) => {
  const { type, title, endAt, id } = activity;

  if (!title) captureException(new Error('[Warning] Activity title is empty'));
  if (!endAt) captureException(new Error('[Warning] Activity endAt is empty'));
  if (!id) captureException(new Error('[Warning] Activity id is empty'));

  const isAssignment = type === 'assignment';

  return (
    <a
      href={
        isAssignment
          ? `https://cyber.gachon.ac.kr/mod/assign/view.php?id=${id}`
          : `https://cyber.gachon.ac.kr/mod/vod/view.php?id=${id}}`
      }
      target="_blank"
      rel="noreferrer"
      className="w-full"
    >
      <div className="flex h-[90px] w-full items-center justify-between rounded-[24px] bg-white p-[16px] text-[#0E0D46] hover:bg-[#FAF2FE]">
        <div className="flex items-center">
          <Icon type={activity.hasSubmitted ? 'check' : 'x'} />
          <div className="relative ml-[20px] w-[160px]">
            <ActivityTag type={activity.type} />
            <h4 className="single-line-ellipsis text-[14px] font-bold">{title}</h4>
            <p className="single-line-ellipsis text-[12px] opacity-70">{courseName}</p>
          </div>
          <div className="ml-[30px]">
            <h4 className="text-[14px]">{convertDateTime(endAt)}</h4>
          </div>
        </div>
        <div className="text-[14px]">{timeFormat(endAt)}</div>
      </div>
    </a>
  );
};

export default ActivityItem;
