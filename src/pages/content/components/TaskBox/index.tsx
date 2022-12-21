import { IAssignment } from '@pages/content/Content';
import styles from './index.module.scss';

interface ITaskBox {
  courseTitle: string;
  assignment: IAssignment;
}

function TaskBox({ courseTitle, assignment }: ITaskBox) {
  const timeFormat = (deadline: string) => {
    const curDate = new Date();
    const dueDate = new Date(deadline);
    const timeDiff = curDate.getTime() - dueDate.getTime();
    const day = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24) + 1);

    return timeDiff > 0 ? '제출마감' : `D-${day}`;
  };

  return (
    <a href={assignment.link} target="_blank">
      <div className={styles.task}>
        <div className="w-[40%]">
          <p className={`${styles.task_courseTitle} ${styles.hidden_text}`}>{courseTitle}</p>
          <p className={`${styles.task_assignmentTitle} ${styles.hidden_text}`}>
            {assignment.title}
          </p>
        </div>
        <div className="text-end">
          <div className="text-[12px]">{assignment.deadline}</div>
          <div className="flex items-center">
            <div className={`${styles.tag} ${styles.tag_time}`}>
              {timeFormat(assignment.deadline)}
            </div>
            {assignment.isDone ? (
              <div className={`${styles.tag} ${styles.tag_done}`}>제출완료</div>
            ) : (
              <div className={`${styles.tag} ${styles.tag_undone}`}>미제출</div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export default TaskBox;
