import { Text } from '@chakra-ui/react'

import ActivityItem from './ActivityItem'
import ChakraMotion from './ChakraMotion'
import ItemList from './ItemList'
import type { ActivityType } from '@/types'

type Props = {
  contentData: ActivityType[]
}

const ActivityList = ({ contentData }: Props) => {
  return (
    <ChakraMotion initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <ItemList
        data={contentData}
        renderItem={activity => <ActivityItem key={activity.id} activity={activity} />}
        renderEmpty={() => (
          <Text fontSize="14px" color="gray.500" textAlign="center">
            진행중인 과제가 없습니다.
          </Text>
        )}
        spacing="16px"
      />
    </ChakraMotion>
  )
}

export default ActivityList
