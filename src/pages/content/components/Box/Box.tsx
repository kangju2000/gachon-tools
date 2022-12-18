import { ICourse } from '@pages/content/Content';
import { useEffect, useState } from 'react';

interface IBox {
  course: ICourse;
  element: Element;
}

function Box({ course, element }: IBox) {
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

  useEffect(() => {
    element.addEventListener('mouseover', () => {
      setIsMouseOver(true);
    });

    element.addEventListener('mouseout', () => {
      setIsMouseOver(false);
    });
  }, []);

  return (
    <>
      {isMouseOver && (
        <div className="w-full h-full flex justify-between">
          <a href={`https://cyber.gachon.ac.kr/course/view.php?id=${course.id}`} target="_blank">
            {course.title} / {course.professor}
          </a>
          <p>
            {course.assignment?.map(item => (
              <>
                <a href={item.link} target="_blank">
                  {item.title}
                </a>
                <p>{item.isDone ? '제출완료' : '미제출'}</p>
              </>
            ))}
          </p>
        </div>
      )}
    </>
  );
}

export default Box;
