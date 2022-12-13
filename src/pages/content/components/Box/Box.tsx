import { ICourse } from '@pages/content/Content';

interface IBox {
  course: ICourse;
}

function Box({ course }: IBox) {
  return (
    <div className="w-full">
      <p>
        {course.title} / {course.professor}
      </p>
      <p>
        {course.assignment?.map(item => (
          <>
            <p>{item.title}</p>
            <p>{item.isDone}</p>
          </>
        ))}
      </p>
    </div>
  );
}

export default Box;
