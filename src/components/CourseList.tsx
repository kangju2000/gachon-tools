import type { Course } from '@/types'

type Props = {
  courseList: Course[]
  selectedCourseId: string
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string>>
}

const CourseList = ({ courseList, selectedCourseId, setSelectedCourseId }: Props) => {
  const isSelected = (id: string) => selectedCourseId === id

  return (
    <div className="flex h-full flex-col space-y-16px">
      {courseList.map(course => (
        <button
          key={course.id}
          className={`text-14px cursor-pointer truncate text-left transition-colors duration-200 ${
            isSelected(course.id)
              ? 'font-bold text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
          }`}
          onClick={() => setSelectedCourseId(course.id)}
        >
          {course.title}
        </button>
      ))}
    </div>
  )
}

export default CourseList
