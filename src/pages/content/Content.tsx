import courseApi from '@apis/course';
import AssignmentCard from '@components/domains/AssignmentCard';
import Modal from '@components/uis/Modal';
import { Listbox } from '@headlessui/react';
import Portal from '@helpers/portal';
import { useEffect, useState } from 'react';
import dummyData from 'src/data/dummyData';
import { generateNewElement, getCourseId } from 'src/utils';

import type { Assignment, Course } from 'src/types';

export default function Content() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCourseElements = async (idList: string[]) => {
    const courseElements = await Promise.all(
      idList.map(async id => {
        const { data } = await courseApi.getCourseById(id);
        const element = generateNewElement(data);
        return element;
      }),
    );

    return courseElements;
  };

  const getAssignments = (element: HTMLElement) => {
    const assignmentLink = element.querySelectorAll('td.cell.c1 > a');
    const deadline = element.getElementsByClassName('cell c2');
    const isDone = element.getElementsByClassName('cell c3');

    const assignments: Assignment[] = Array.from({
      length: assignmentLink.length,
    }).reduce<Assignment[]>((acc, _, i) => {
      return [
        ...acc,
        {
          title: assignmentLink[i].textContent as string,
          link: (assignmentLink[i] as HTMLAnchorElement).href,
          deadline: deadline[i].textContent as string,
          isDone:
            isDone[i].textContent === '제출 완료' ||
            isDone[i].textContent === 'Submitted for grading',
        },
      ];
    }, []);

    return assignments;
  };

  const getCourseList = async () => {
    const professorElements = document.getElementsByClassName('prof');
    const courseLinkElements = document.getElementsByClassName('course_link');

    const professorList = Array.from(professorElements).map(element => element.textContent);
    const courseIdList = Array.from(courseLinkElements).map(element =>
      getCourseId((element as HTMLAnchorElement).href),
    );

    const courseElements = await getCourseElements(courseIdList);

    const courseArray = courseElements.reduce<Course[]>((acc, courseElement, i) => {
      const id = courseIdList[i];
      const name = courseElement.getElementsByClassName('breadcrumb')[0].textContent;
      const professor = professorList[i];
      const assignments = getAssignments(courseElement);

      return [...acc, { id, name, professor, assignments }];
    }, []);

    setCourseList(courseArray);
    setSelectedCourse(courseArray[0]);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      getCourseList();
      return;
    }

    setCourseList(dummyData);
    setSelectedCourse(dummyData[0]);
  }, []);

  console.log(courseList);
  return (
    <>
      <Portal elementId="modal">
        <Modal isOpen={isModalOpen}>
          {selectedCourse && (
            <>
              <Listbox value={selectedCourse} onChange={setSelectedCourse}>
                <Listbox.Button>{selectedCourse.name}</Listbox.Button>
                <Listbox.Options>
                  {courseList.map(course => (
                    <Listbox.Option key={course.id} value={course}>
                      {course.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
              <div className="flex flex-col gap-2 mt-4">
                {selectedCourse.assignments?.map(assignment => (
                  <AssignmentCard
                    key={assignment.title}
                    assignment={assignment}
                    courseName={selectedCourse.name}
                  />
                ))}
              </div>
            </>
          )}
        </Modal>
      </Portal>
      <div
        className="w-[40px] h-[40px] rounded-[50px] bg-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></div>
    </>
  );
}
