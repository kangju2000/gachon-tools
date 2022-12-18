import { createRoot } from 'react-dom/client';
import '@styles/globals.css';
import '@styles/reset.css';
import Box from '@pages/content/components/Box/Box';
import axios from 'axios';

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

const courseList: ICourse[] = [];

const getCourseId = (link: string) => {
  return link.split('=')[1];
};

const getElement = (data: string) => {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
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

const courseLinkList = document.getElementsByClassName('course_link');
const courseDetailList = document.getElementsByClassName('course-title');
const boxElements = document.getElementsByClassName('course_box');

[...boxElements].forEach((element, i) => {
  const link = (courseLinkList[i] as HTMLAnchorElement).href;
  const id = getCourseId(link);
  const [title, professor] = (courseDetailList[i] as HTMLElement).innerText.split('\n\n');

  getAssignment(id).then(assignment => {
    const root = document.createElement('div');
    root.id = `content-view-root-${i}`;
    element.append(root);
    createRoot(root).render(
      <Box course={{ id, title, professor, assignment }} element={element} />,
    );
  });
});
