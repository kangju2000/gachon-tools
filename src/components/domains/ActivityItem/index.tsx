import type { ActivityType } from '@/types';

import { ReactComponent as CheckIcon } from '@/assets/circle_check.svg';
import { ReactComponent as XMarkIcon } from '@/assets/circle_x.svg';
import { timeFormat } from '@/utils';

type Props = {
  activity: ActivityType;
  courseName: string;
};

const Icon = ({ type }: { type: 'check' | 'x' }) =>
  ({
    check: <CheckIcon width={38} height={38} />,
    x: <XMarkIcon width={38} height={38} />,
  }[type]);

const ActivityItem = ({ activity, courseName }: Props) => {
  const { title, startAt, endAt, id } = activity;

  return (
    <a
      href={`https://cyber.gachon.ac.kr/mod/assign/view.php?id=${id}`} // TODO: 과제 타입에 따라 링크 변경
      target="_blank"
      rel="noreferrer"
      className="w-full"
    >
      <div className="flex justify-between items-center w-full h-[70px] p-[16px] rounded-[24px] text-[#0E0D46] bg-white hover:bg-[#FAF2FE]">
        <div className="flex items-center">
          <Icon type={'check'} />
          <div className="w-[160px] ml-[20px]">
            <h4 className="text-[14px] font-bold single-line-ellipsis">{title}</h4>
            <p className="text-[12px] opacity-70 ">{courseName}</p>
          </div>
          <div className="ml-[30px]">
            <h4 className="text-[14px]">{`${startAt.toLocaleDateString()} ${endAt.toLocaleDateString()}`}</h4>
            {/* TODO: 시간 format */}
          </div>
        </div>
        <div className="text-[14px]">{timeFormat(endAt)}</div>
      </div>
    </a>
  );
};

export default ActivityItem;
