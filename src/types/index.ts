interface Activity {
  id: string;
  courseId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  hasSubmitted: boolean;
}
export interface Course {
  id: string;
  title: string;
}

export interface Assignment extends Activity {}

export interface Video extends Activity {
  timeInfo: string;
}

export type ActivityType = Assignment | Video;
