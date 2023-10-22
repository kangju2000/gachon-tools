import { Badge, Box, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'

import { CheckIcon, XMarkIcon } from './Icons'

import type { ActivityType } from '@/types'

type Props = {
  activity: ActivityType
}

const ActivityItem = ({ activity }: Props) => {
  const dDay = formatDistanceToNowStrict(new Date(activity.endAt), {
    addSuffix: true,
    locale: ko,
  })

  return (
    <Card
      as="a"
      minH="72px"
      textDecoration="none !important"
      cursor="pointer"
      href={`https://cyber.gachon.ac.kr/mod/${
        activity.type === 'assignment' ? 'assign' : 'vod'
      }/view.php?id=${activity.id}`}
    >
      <CardBody display="flex" alignItems="center" justifyContent="space-between" px="16px">
        <Flex align="center" gap="8px">
          {activity.hasSubmitted ? <CheckIcon /> : <XMarkIcon />}
          <Box>
            <Flex align="center" gap="4px">
              <ActivityBadge type={activity.type} />
              <Text fontSize="14px" fontWeight="600">
                {activity.title}
              </Text>
            </Flex>
            <Text fontSize="12px" color="gray.500">
              {activity.courseTitle}
            </Text>
          </Box>
        </Flex>
        <Box textAlign="end">
          <Text fontSize="14px">{dDay} 마감</Text>
          <Text fontSize="12px" color="gray.500">
            ~{format(new Date(activity.endAt), 'yyyy.MM.dd HH:mm')}
          </Text>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ActivityItem

const ActivityBadge = ({ type }: { type: ActivityType['type'] }) => {
  if (type === 'assignment') {
    return (
      <Badge variant="solid" colorScheme="blue" fontSize="12px" px="4px" borderRadius="2px">
        과제
      </Badge>
    )
  }

  if (type === 'video') {
    return (
      <Badge variant="solid" colorScheme="gray" fontSize="12px" px="4px" borderRadius="2px">
        영상
      </Badge>
    )
  }
}
