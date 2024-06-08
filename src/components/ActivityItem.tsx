import { Badge, Highlight, Box, Card, CardBody, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

import { CheckIcon, XMarkIcon } from './Icons'
import type { ActivityType } from '@/types'

type Props = {
  activity: ActivityType
}

const ActivityItem = ({ activity }: Props) => {
  const endAtDate = new Date(activity.endAt)
  const dDay = isValid(endAtDate) ? formatDistanceToNowStrict(endAtDate, { addSuffix: true, locale: ko }) : '기한 없음'

  const cardBgHover = useColorModeValue('gray.50', 'gray.800')
  const descriptionColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Card
      as="a"
      minH="72px"
      cursor="pointer"
      href={`https://cyber.gachon.ac.kr/mod/${activity.type === 'assignment' ? 'assign' : 'vod'}/view.php?id=${
        activity.id
      }`}
      bg="modalBg"
      _hover={{ bg: cardBgHover }}
      transition="background 0.1s"
    >
      <CardBody display="flex" alignItems="center" justifyContent="space-between" gap="10px" px="16px">
        <Flex align="center" gap="10px">
          {activity.hasSubmitted ? <CheckIcon flexShrink="0" /> : <XMarkIcon flexShrink="0" />}
          <Box>
            <Flex align="center" gap="4px">
              <ActivityBadge type={activity.type} />
              <Text fontSize="14px" fontWeight="600" noOfLines={1}>
                {activity.title}
              </Text>
            </Flex>
            <Text fontSize="12px" noOfLines={1} color={descriptionColor}>
              {activity.courseTitle}
            </Text>
          </Box>
        </Flex>
        <Box textAlign="end" flexShrink="0">
          <Text fontSize="14px" noOfLines={1}>
            <Highlight query="마감" styles={{ fontSize: '12px', fontWeight: '400', color: 'inherit' }}>
              {`${dDay} 마감`}
            </Highlight>
          </Text>
          <Text fontSize="12px" noOfLines={1} color={descriptionColor}>
            {isValid(endAtDate) && `~${format(endAtDate, 'yyyy.MM.dd HH:mm')}`}
          </Text>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ActivityItem

const ActivityBadge = ({ type }: { type: ActivityType['type'] }) => {
  const badge = {
    assignment: { color: 'blue', text: '과제' },
    video: { color: 'gray', text: '영상' },
  }[type]

  return (
    <Badge
      variant="solid"
      colorScheme={badge.color}
      fontSize="9px"
      fontWeight="700"
      px="4px"
      py="2px"
      borderRadius="4px"
    >
      {badge.text}
    </Badge>
  )
}
