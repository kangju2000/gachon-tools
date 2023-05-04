import Filter from '@components/uis/Filter';
import { Course } from 'src/types';

type Props = {
  courseList: Course[];
  selectedCourse: Course;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course>>;

  sortType: string;
  setSortType: React.Dispatch<React.SetStateAction<string>>;

  statusType: string;
  setStatusType: React.Dispatch<React.SetStateAction<string>>;
};

const AssignmentFilter = ({
  courseList,
  selectedCourse,
  setSelectedCourse,
  sortType,
  setSortType,
  statusType,
  setStatusType,
}: Props) => {
  return (
    <div className="flex justify-between items-center">
      <Filter
        value={selectedCourse}
        onChange={setSelectedCourse}
        hasBorder={false}
        maxWidth="300px"
      >
        <Filter.Header className="text-[18px] font-bold" name={selectedCourse.name} />
        <Filter.Modal pos="left">
          {courseList.map(course => (
            <Filter.Item key={course.id} item={course}>
              {course.name}
            </Filter.Item>
          ))}
        </Filter.Modal>
      </Filter>
      <div className="flex gap-[16px]">
        <Filter value={sortType} onChange={setSortType}>
          <Filter.Header name={sortType} />
          <Filter.Modal>
            <Filter.Item item="마감일 순">마감일 순</Filter.Item>
            <Filter.Item item="최신 순">최신 순</Filter.Item>
          </Filter.Modal>
        </Filter>
        <Filter value={statusType} onChange={setStatusType}>
          <Filter.Header name={statusType} />
          <Filter.Modal>
            <Filter.Item item="진행중인 과제">진행중인 과제</Filter.Item>
            <Filter.Item item="모든 과제">모든 과제</Filter.Item>
          </Filter.Modal>
        </Filter>
      </div>
    </div>
  );
};

export default AssignmentFilter;
