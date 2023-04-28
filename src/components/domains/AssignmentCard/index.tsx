import type { Assignment } from 'src/types';

type Props = {
  assignment: Assignment;
};

const AssignmentCard = ({ assignment }: Props) => {
  return (
    <div className="flex">
      <h5 className="card-title">{assignment.title}</h5>
      <p className="card-text">{assignment.deadline}</p>
    </div>
  );
};

export default AssignmentCard;
