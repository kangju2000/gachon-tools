interface Activity {
  id: string
  courseId: string
  title: string
  sectionTitle: string
  startAt: string // 시작 날짜 없는 과제도 존재 ex) No time limit
  endAt: string // 마감 날짜 없는 과제가 있나? 확실하지 않음
  hasSubmitted: boolean
}
export interface Course {
  id: string
  title: string
}

export interface Assignment extends Activity {
  type: 'assignment'
}

export interface Video extends Activity {
  type: 'video'
  timeInfo: string
}

export type ActivityType = Assignment | Video
