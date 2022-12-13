import { ICourse } from '@pages/content/Content';

interface IBox {
  course: ICourse;
}

function Box({ course }: IBox) {
  return (
    <div className="w-full flex justify-between">
      <a href={`https://cyber.gachon.ac.kr/course/view.php?id=${course.id}`}>
        {course.title} / {course.professor}
      </a>
      <p>
        {course.assignment?.map(item => (
          <>
            <a href={item.link}>{item.title}</a>
            <p>{item.isDone ? '제출완료' : '미제출'}</p>
          </>
        ))}
      </p>
    </div>
  );
}

export default Box;
