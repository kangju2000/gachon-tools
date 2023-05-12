// export interface Assignment {
//   id: string;
//   courseId: string;
//   title: string;
//   link: string;
//   deadline: string;
//   isDone: boolean;
// }

// export interface Course {
//   id: string;
//   name: string;
//   professor: string;
// }

export interface Course {
  id: string;
  title: string;
  professor: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  startAt: Date;
  endAt: Date;
}

export interface Video {
  id: string;
  courseId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  timeInfo: string;
}
