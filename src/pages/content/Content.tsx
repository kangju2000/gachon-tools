import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from './components/Box/Box';

export interface IAssignment {
  title: string;
  link: string;
  deadline: string;
  isDone: boolean;
}

export interface ICourse {
  id: string;
  title: string;
  professor: string;
  assignment?: IAssignment[];
}

function Content() {
  const [courseList, setCourseList] = useState<ICourse[]>([]);
  const [isFound, setIsFound] = useState<boolean>(false);

  const getElement = (data: string) => {
    const element = document.createElement('div');
    element.innerHTML = data;
    return element;
  };

  const getCourseId = (link: string) => {
    return link.split('=')[1];
  };

  const getAssignment = async (id: string) => {
    const data = await axios
      .get(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${id}`)
      .then(res => res.data);
    const element = getElement(data);
    const assignmentLink = element.querySelectorAll('td.cell.c1 > a');
    const deadline = element.getElementsByClassName('cell c2');
    const isDone = element.getElementsByClassName('cell c3');

    let assignment: IAssignment[] = [];

    Array.from({ length: assignmentLink.length }).forEach((_, i) => {
      assignment.push({
        title: assignmentLink[i].textContent as string,
        link: (assignmentLink[i] as HTMLAnchorElement).href,
        deadline: deadline[i].textContent as string,
        isDone: isDone[i].textContent === '제출 완료', // 영어 강의일 경우 바꿔야 함
      });
    });

    return assignment;
  };

  const init = () => {
    const courseLinkList = document.getElementsByClassName('course_link');
    const courseDetailList = document.getElementsByClassName('course-title');

    Array.from({ length: courseLinkList.length }).forEach((_, i) => {
      const link = (courseLinkList[i] as HTMLAnchorElement).href;
      const id = getCourseId(link);
      const [title, professor] = (courseDetailList[i] as HTMLElement).innerText.split('\n\n');
      getAssignment(id).then(assignment =>
        setCourseList(prev => [...prev, { id, title, professor, assignment }]),
      );
    });
  };

  useEffect(() => {
    console.log('로드 성공');
    init();
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          console.log(courseList);
        }}
      >
        과제 찾기
      </button>
      {courseList ? courseList.map(course => <Box course={course} />) : <p>로딩중...</p>}
    </div>
  );
}

export default Content;
