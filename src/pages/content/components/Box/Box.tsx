import { ICourse } from '@pages/content/Content';

interface IBox {
  course: ICourse;
}

function Box({ course }: IBox) {

  return (
      <div className="flex justify-between w-full px-[21px] py-[20px]">
        <a href={`https://cyber.gachon.ac.kr/course/view.php?id=${course.id}`} target="_blank">
          {course.title} / {course.professor}
        </a>
        <p>
          {course.assignments?.map(item => (
            <>
              <a href={item.link} target="_blank">
                {item.title}
              </a>
              <p>{item.isDone ? '제출완료' : '미제출'}</p>
            </>
          ))}
        </p>
      </div>
  );
}

export default Box;
