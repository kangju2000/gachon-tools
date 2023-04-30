import { ReactComponent as CheckIcon } from '@assets/circle_check.svg';
import { ReactComponent as MinusIcon } from '@assets/circle_minus.svg';
import { ReactComponent as XMarkIcon } from '@assets/circle_x.svg';
import { timeFormat } from 'src/utils';

import type { Assignment } from 'src/types';

type Props = {
  assignment: Assignment;
  courseName: string;
};

const Icon = ({ type }: { type: 'check' | 'minus' | 'x' }) =>
  ({
    check: <CheckIcon width={38} height={38} />,
    minus: <MinusIcon width={38} height={38} />,
    x: <XMarkIcon width={38} height={38} />,
  }[type]);

const AssignmentItem = ({ assignment, courseName }: Props) => {
  const { title, deadline, isDone, link } = assignment;
  const currentDate = new Date();
  const targetDate = new Date(deadline);

  const iconType = isDone ? 'check' : currentDate < targetDate ? 'x' : 'minus';

  return (
    <a href={link} target="_blank" rel="noreferrer" className="text-[#0E0D46]">
      <div className="flex justify-between items-center w-[600px] h-[70px] p-[16px] rounded-[24px] bg-white hover:bg-[#FAF2FE]">
        <div className="flex items-center">
          <Icon type={iconType} />
          <div className="w-[160px] ml-[20px]">
            <h4 className="text-[14px] font-bold">{title}</h4>
            <p className="text-[12px] opacity-70">{courseName}</p>
          </div>
          <div className="ml-[30px]">
            <h4 className="text-[14px]">{deadline}</h4>
          </div>
        </div>
        <div className="text-[14px]">{timeFormat(assignment.deadline)}</div>
      </div>
    </a>
  );
};

export default AssignmentItem;
