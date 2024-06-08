import { Stack, Text, useColorModeValue } from '@chakra-ui/react'

import type { Course } from '@/types'

type Props = {
  courseList: Course[]
  selectedCourseId: string
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string>>
}

const CourseList = ({ courseList, selectedCourseId, setSelectedCourseId }: Props) => {
  const unselectedColor = useColorModeValue('gray.600', 'gray.400')
  const selectedColor = useColorModeValue('blue.600', 'blue.400')

  const isSelected = (id: string) => selectedCourseId === id

  return (
    <Stack spacing="16px" h="100%">
      {courseList.map(course => (
        <Text
          key={course.id}
          flexShrink="0"
          fontSize="14px"
          fontWeight={isSelected(course.id) ? 'bold' : 'normal'}
          color={isSelected(course.id) ? selectedColor : unselectedColor}
          _hover={{ color: selectedColor }}
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
