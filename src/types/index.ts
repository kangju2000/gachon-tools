export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  link: string;
  deadline: string;
  isDone: boolean;
}

export interface Course {
  id: string;
  name: string;
  professor: string;
}
