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

  const setAssignment = async (id: string) => {
    const data = await axios
      .get(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${id}`)
      .then(res => res.data);
    const element = getElement(data);

    const assignmentLink = element.querySelectorAll('td.cell.c1 > a');
    const deadline = element.getElementsByClassName('cell c2');
    const isDone = element.getElementsByClassName('cell c3');

    let assignList: IAssignment[] = [];
    Array.from({ length: assignmentLink.length }).forEach((_, i) => {
      assignList.push({
        title: assignmentLink[i].textContent as string,
        link: (assignmentLink[i] as HTMLAnchorElement).href,
        deadline: deadline[i].textContent as string,
        isDone: isDone[i].textContent === '제출 완료', // 영어 강의일 경우 바꿔야 함
      });
    });

    const updateCourseList = courseList.map(course => {
      if ((course.id = id)) {
        return {
          ...course,
          assignment: assignList,
        };
      }
      return course;
    });

    setCourseList(updateCourseList);
  };

  const onSearchClick = () => {
    courseList.map(course => {
      setAssignment(course.id);
    });

    setIsFound(true);
  };

  useEffect(() => {
    console.log('로드 성공');
    const courseLinkList = document.getElementsByClassName('course_link');
    const courseDetailList = document.getElementsByClassName('course-title');

    Array.from({ length: courseLinkList.length }).forEach((_, i) => {
      const link = (courseLinkList[i] as HTMLAnchorElement).href;
      const [title, professor] = (courseDetailList[i] as HTMLElement).innerText.split('\n\n');
      setCourseList(prev => [...prev, { id: getCourseId(link), title, professor }]);
    });
  }, []);

  return (
    <div>
      <button onClick={onSearchClick}>과제 찾기</button>
      {isFound ? courseList.map(course => <Box course={course} />) : <p>로딩중...</p>}
    </div>
  );
}

export default Content;
