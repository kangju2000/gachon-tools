import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { ko } from 'date-fns/locale'

import ActivityItem from './ActivityItem'
import { RefreshIcon } from './Icons'
import LoadingProgress from './LoadingProgress'

import useGetContents from '@/hooks/useGetContents'
import filteredActivities from '@/utils/filteredActivityList'
import foramtDate from '@/utils/formatDate'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
  const {
    data: { courseList, activityList, updateAt },
    pos,
    refetch,
    isLoading,
  } = useGetContents({ enabled: isOpen, local: false })

  console.log(isLoading, pos, activityList)

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW="750px" h="500px" borderRadius="8px">
        <ModalHeader
          display="flex"
          alignItems="center"
          minH="60px"
          px="24px"
          color="gray.700"
          fontSize="large"
          fontWeight="700"
        >
          Gachon Tools
          <ModalCloseButton
            size="lg"
            top="16px"
            right="16px"
            border="none"
            _focus={{
              outline: 'none',
              bg: 'none',
            }}
            _focusVisible={{
              boxShadow: 'none',
            }}
          />
        </ModalHeader>
        <Divider m="0" />
        <ModalBody display="flex" p="0" overflow="hidden">
          <Stack spacing="16px" w="200px" p="24px" bg="gray.200" overflowY="scroll"></Stack>
          <Box flex="1" overflowY="scroll" px="24px" h="100%">
            <Tabs>
              <TabList position="sticky" top="0" zIndex="1" bg="white" pt="16px">
                <Tab
                  fontSize="14px"
                  borderRadius="none"
                  border="none"
                  outline="none !important"
                  _focus={{ outline: 'none', bg: 'none', border: 'none' }}
                  _active={{ outline: 'none', bg: 'none' }}
                  _selected={{ color: 'blue.600', borderBottom: '2px solid' }}
                >
                  진행중인 과제
                </Tab>
                <Tab
                  fontSize="14px"
                  borderRadius="none"
                  border="none"
                  outline="none !important"
                  _focus={{ outline: 'none', bg: 'none', border: 'none' }}
                  _active={{ outline: 'none', bg: 'none' }}
                  _selected={{ color: 'blue.600', borderBottom: '2px solid' }}
                >
                  모든 과제
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {isLoading ? (
                    <LoadingProgress pos={pos} />
                  ) : (
                    <Stack spacing="16px">
                      {filteredActivities(activityList, '-1', '진행중인 과제', false).map(
                        activity => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ),
                      )}
                    </Stack>
                  )}
                </TabPanel>
                <TabPanel minH="100%">
                  {isLoading ? (
                    <LoadingProgress pos={pos} />
                  ) : (
                    <Stack spacing="16px">
                      {activityList.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </Stack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </ModalBody>
        <Divider m="0" />
        <ModalFooter h="60px" px="24px">
          <Text fontSize="12px" color="gray.600" mr="4px">
            {isLoading ? '불러오는 중...' : `${foramtDate(ko, updateAt)} 업데이트`}
          </Text>
          <RefreshIcon color="gray.600" onClick={refetch} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContentModal
