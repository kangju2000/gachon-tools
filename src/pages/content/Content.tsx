import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskBox from './components/TaskBox';
import styles from './index.module.scss';

const dummyData = [
  {
    id: '79609',
    title: '컴퓨터그래픽스 (07943_003) (2학기)',
    professor: '황재천',
    assignments: [
      {
        title: '과제_1차',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=581089',
        deadline: '2022-10-08 00:00',
        isDone: true,
      },
      {
        title: '과제_2차',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=591262',
        deadline: '2022-10-19 00:00',
        isDone: false,
      },
      {
        title: '과제_4차',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=613488',
        deadline: '2022-12-09 00:00',
        isDone: false,
      },
    ],
  },
  {
    id: '79658',
    title: '운영체제 (08306_001) (2학기)',
    professor: '오상엽',
    assignments: [],
  },
  {
    id: '82194',
    title: 'JAVA (13979_001) (2학기)',
    professor: '윤유림',
    assignments: [
      {
        title: 'Programming Test #0dkdkdkdkdkdkdkdkdkdkdkdkdkdkdk',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561658',
        deadline: '2020-09-08 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #1',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561663',
        deadline: '2022-09-16 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #2',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561667',
        deadline: '2022-09-23 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #3',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561672',
        deadline: '2022-10-07 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #4',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561676',
        deadline: '2022-10-14 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #5',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561691',
        deadline: '2022-11-04 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #6',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=601860',
        deadline: '2022-11-04 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #7',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561697',
        deadline: '2022-11-18 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #8',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561702',
        deadline: '2022-11-18 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #9',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561709',
        deadline: '2022-11-25 23:00',
        isDone: false,
      },
      {
        title: 'Programming Test #10',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=561715',
        deadline: '2022-12-02 23:00',
        isDone: false,
      },
    ],
  },
  {
    id: '80677',
    title: '사회봉사 (12427_038) (2학기)',
    professor: '이병문',
    assignments: [],
  },
  {
    id: '79655',
    title: '데이터베이스 (08296_006) (2학기)',
    professor: '윤영미',
    assignments: [
      {
        title: 'UNIVERSITY 데이터베이스 설계',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=586409',
        deadline: '2022-10-10 00:00',
        isDone: true,
      },
      {
        title: 'ch4연습문제',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=600877',
        deadline: '2022-11-01 12:00',
        isDone: true,
      },
      {
        title: 'Movie.sql',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=603418',
        deadline: '2022-11-07 00:00',
        isDone: true,
      },
      {
        title: 'sql문제1',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=605371',
        deadline: '2022-11-14 00:00',
        isDone: true,
      },
      {
        title: 'sql문제2',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=605374',
        deadline: '2022-11-14 00:00',
        isDone: true,
      },
      {
        title: '스스로푸는질의',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=610207',
        deadline: '2022-11-21 00:00',
        isDone: true,
      },
      {
        title: '인덱스',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=610573',
        deadline: '2022-11-28 00:00',
        isDone: true,
      },
    ],
  },
  {
    id: '80637',
    title: '창의적 사고 (12410_001) (2학기)',
    professor: '조선희',
    assignments: [
      {
        title: '수업요약문제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=566084',
        deadline: '2022-09-16 00:00',
        isDone: false,
      },
      {
        title: '추석연휴 수업 요약문 제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=553547',
        deadline: '2022-09-16 00:00',
        isDone: false,
      },
      {
        title: '창의력 훈련일지과제 제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=553290',
        deadline: '2022-12-03 00:00',
        isDone: true,
      },
    ],
  },
  {
    id: '80615',
    title: '플랫폼 혁명의 이해 (12402_001) (2학기)',
    professor: '이승훈',
    assignments: [],
  },
  {
    id: '82530',
    title: '지성학Ⅱ (14572_001) (2학기)',
    professor: '이두형',
    assignments: [
      {
        title: '[필수] 지성학2 중간과제 제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=590885',
        deadline: '2022-10-21 23:59',
        isDone: true,
      },
      {
        title: '지성학2 중간과제 지연제출자 추가과제 제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=604981',
        deadline: '2022-12-09 23:59',
        isDone: false,
      },
      {
        title: '[필수] 지성학2 기말과제 제출',
        link: 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=614044',
        deadline: '2022-12-09 23:59',
        isDone: true,
      },
    ],
  },
  {
    id: '73208',
    title: '2022 폭력예방교육 (글로벌 재학생 2학년~5학년 대상)',
    professor: '이윤우 / 송채수',
    assignments: [],
  },
];

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
  assignments?: IAssignment[];
}

export interface IContent {
  element: any;
}

function Content() {
  const [courseList, setCourseList] = useState<ICourse[]>([]);
  const [currentMenuId, setCurrentMenuId] = useState<string>('');

  const getElement = (data: string) => {
    const element = document.createElement('div');
    element.innerHTML = data;
    return element;
  };

  const getCourseId = (link: string) => {
    return link.split('=')[1];
  };

  const getCourseElement = async (id: string) => {
    const response = await axios.get(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${id}`);
    const data = await response.data;
    const element = getElement(data);

    return element;
  };

  const getAssignments = (element: HTMLElement) => {
    const assignmentLink = element.querySelectorAll('td.cell.c1 > a');
    const deadline = element.getElementsByClassName('cell c2');
    const isDone = element.getElementsByClassName('cell c3');

    const assignments: IAssignment[] = [];

    Array.from({ length: assignmentLink.length }).forEach((_, i) => {
      assignments.push({
        title: assignmentLink[i].textContent as string,
        link: (assignmentLink[i] as HTMLAnchorElement).href,
        deadline: deadline[i].textContent as string,
        isDone:
          isDone[i].textContent === '제출 완료' ||
          isDone[i].textContent === 'Submitted for grading',
      });
    });

    return assignments;
  };

  const getCourses = () => {
    const courseLinkList = document.getElementsByClassName('course_link');
    const professorList = document.getElementsByClassName('prof');

    Array.from({ length: courseLinkList.length }).forEach((_, i) => {
      const id = getCourseId((courseLinkList[i] as HTMLAnchorElement).href);
      const professor = professorList[i].textContent as string;

      getCourseElement(id).then(element => {
        const assignments = getAssignments(element);
        const title = element.getElementsByClassName('breadcrumb')[0].textContent as string;
        setCourseList(prev => [...prev, { id, title, professor, assignments }]);
      });
    });
  };

  useEffect(() => {
    process.env.NODE_ENV === 'production' ? getCourses() : setCourseList(dummyData);
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <h1 className={`text-[22px]`}>내 과제 리스트</h1>
        <div className={styles.line}></div>
        <p
          className={`${styles.courseTitle} ${
            currentMenuId === '' ? 'text-[#0370a6]' : 'text-inherit'
          }`}
          onClick={() => setCurrentMenuId('')}
        >
          전체 보기
        </p>
        {courseList.map(course => (
          <p
            className={`${styles.courseTitle} ${
              currentMenuId === course.id ? 'text-[#0370a6]' : 'text-inherit'
            }`}
            onClick={() => setCurrentMenuId(course.id)}
          >
            {course.title}
          </p>
        ))}
      </nav>
      <section className={styles.taskList}>
        <button className={styles.btn_filter}>시간 순</button>
        {(currentMenuId
          ? courseList.filter(course => course.id === currentMenuId)
          : courseList
        ).map(course =>
          course.assignments?.map(assignment => (
            <TaskBox courseTitle={course.title} assignment={assignment} />
          )),
        )}
      </section>
    </div>
  );
}

export default Content;
