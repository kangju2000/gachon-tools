interface Activity {
  id: string;
  courseId: string;
  title: string;
  endAt: string;
  hasSubmitted: boolean;
}
export interface Course {
  id: string;
  title: string;
}

export interface Assignment extends Activity {
  type: 'assignment';
}

export interface Video extends Activity {
  type: 'video';
  timeInfo: string;
}

export type ActivityType = Assignment | Video;
