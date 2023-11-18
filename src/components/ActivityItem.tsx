import { chakra, Badge, Box, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

import { CheckIcon, XMarkIcon } from './Icons'
import type { ActivityType } from '@/types'

type Props = {
  activity: ActivityType
}

const ActivityItem = ({ activity }: Props) => {
  const endAtDate = new Date(activity.endAt)
  const dDay =
    isValid(endAtDate) && formatDistanceToNowStrict(endAtDate, { addSuffix: true, locale: ko })

  return (
    <Card
      as="a"
      minH="72px"
      textDecoration="none !important"
      cursor="pointer"
      href={`https://cyber.gachon.ac.kr/mod/${
        activity.type === 'assignment' ? 'assign' : 'vod'
      }/view.php?id=${activity.id}`}
      _hover={{
        _light: {
          bg: 'gray.50',
        },
        _dark: {
          bg: 'gray.800',
        },
      }}
      transition="background 0.2s"
    >
      <CardBody
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="10px"
        px="16px"
      >
        <Flex align="center" gap="10px">
          {activity.hasSubmitted ? <CheckIcon flexShrink="0" /> : <XMarkIcon flexShrink="0" />}
          <Box>
            <Flex align="center" gap="4px">
              <ActivityBadge type={activity.type} />
              <Text fontSize="14px" fontWeight="600" noOfLines={1}>
                {activity.title}
              </Text>
            </Flex>
            <Text
              fontSize="12px"
              noOfLines={1}
              _light={{ color: 'gray.500' }}
              _dark={{ color: 'gray.400' }}
            >
              {activity.courseTitle}
            </Text>
          </Box>
        </Flex>
        <Box textAlign="end" flexShrink="0">
          <Text fontSize="14px" noOfLines={1}>
            {dDay ? (
              <>
                {dDay + ' '}
                <chakra.span fontSize="12px" fontWeight="400">
                  마감
                </chakra.span>
              </>
            ) : (
              '기한 없음'
            )}
          </Text>
          <Text
            fontSize="12px"
            _light={{ color: 'gray.500' }}
            _dark={{ color: 'gray.400' }}
            noOfLines={1}
          >
            {isValid(endAtDate) && `~${format(endAtDate, 'yyyy.MM.dd HH:mm')}`}
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
      <Badge
        variant="solid"
        colorScheme="blue"
        fontSize="9px"
        fontWeight="700"
        px="4px"
        py="2px"
        borderRadius="4px"
      >
        과제
      </Badge>
    )
  }

  if (type === 'video') {
    return (
      <Badge
        variant="solid"
        colorScheme="gray"
        fontSize="9px"
        fontWeight="700"
        px="4px"
        py="2px"
        borderRadius="4px"
      >
        영상
      </Badge>
    )
  }
}
