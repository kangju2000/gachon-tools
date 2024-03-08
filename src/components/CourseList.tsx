import { Stack, Text } from '@chakra-ui/react'

import type { Course } from '@/types'

type Props = {
  courseList: Course[]
  selectedCourseId: string
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string>>
}

const CourseList = ({ courseList, selectedCourseId, setSelectedCourseId }: Props) => {
  return (
    <Stack
      spacing="16px"
      h="100%"
      sx={{
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {courseList.map(course => (
        <Text
          key={course.id}
          flexShrink="0"
          fontSize="14px"
          fontWeight={selectedCourseId === course.id ? '600' : '400'}
          _light={{ color: selectedCourseId === course.id ? 'blue.600' : 'gray.600' }}
          _dark={{ color: selectedCourseId === course.id ? 'blue.400' : 'gray.400' }}
          _hover={{
            _light: { color: 'blue.600' },
            _dark: { color: 'blue.400' },
          }}
          transition="color 0.2s"
          cursor="pointer"
          onClick={() => setSelectedCourseId(course.id)}
          noOfLines={1}
        >
          {course.title}
        </Text>
      ))}
    </Stack>
  )
}

export default CourseList
