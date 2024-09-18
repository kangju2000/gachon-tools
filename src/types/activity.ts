interface BaseActivity {
  id: string
  courseId: string
  courseTitle: string
  title: string
  startAt: string
  endAt: string
  hasSubmitted: boolean
}
export interface Course {
  id: string
  title: string
}

export interface Assignment extends BaseActivity {
  type: 'assignment'
}

export interface Video extends BaseActivity {
  type: 'video'
  sectionTitle: string
}

export type Activity = Assignment | Video

export type Contents = {
  courseList: Course[]
  activityList: Activity[]
}
