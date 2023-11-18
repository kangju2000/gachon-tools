import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import ActivityList from './ActivityList'
import LoadingProgress from './LoadingProgress'
import { TAB_LIST } from '@/constants'
import useFilteredActivityList from '@/hooks/useFilteredActivityList'
import { ActivityType } from '@/types'

type Props = {
  activityList: ActivityType[]
  selectedCourseId: string
  pos: number
  isLoading: boolean
}

const TabContent = ({ activityList, selectedCourseId, pos, isLoading }: Props) => {
  const [tabIndex, setTabIndex] = useState(0)
  const filteredActivities = useFilteredActivityList(
    activityList,
    selectedCourseId,
    tabIndex,
    false,
  )

  return (
    <Tabs isLazy={true} index={tabIndex} onChange={index => setTabIndex(index)}>
      <TabList
        position="sticky"
        top="0"
        zIndex="1"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'gray.700' }}
        pt="16px"
      >
        {TAB_LIST.map(tab => (
          <Tab
            position="relative"
            fontSize="14px"
            borderRadius="none"
            border="none"
            outline="none !important"
            _hover={{
              _dark: { bg: 'blue.800', color: 'white' },
            }}
            _focus={{ outline: 'none', bg: 'none', border: 'none' }}
            _active={{ outline: 'none', bg: 'none' }}
            _light={{ color: 'gray.700', _selected: { color: 'blue.600' } }}
            _dark={{ color: 'gray.200', _selected: { color: 'blue.400' } }}
            _selected={{ color: 'blue.600', borderBottom: '2px solid' }}
          >
            {tab}
          </Tab>
        ))}
      </TabList>

      <TabPanels as={AnimatePresence}>
        <TabPanel>
          {isLoading ? (
            <LoadingProgress pos={pos} />
          ) : (
            <ActivityList contentData={filteredActivities} />
          )}
        </TabPanel>
        <TabPanel>
          {isLoading ? (
            <LoadingProgress pos={pos} />
          ) : (
            <ActivityList contentData={filteredActivities} />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default TabContent
