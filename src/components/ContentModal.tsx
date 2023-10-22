import {
  Box,
  Center,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { ko } from 'date-fns/locale'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import ActivityList from './ActivityList'
import { RefreshIcon, SettingIcon } from './Icons'
import LoadingProgress from './LoadingProgress'
import PopoverOptions from './PopoverOptions'

import useGetContents from '@/hooks/useGetContents'
import filteredActivities from '@/utils/filteredActivityList'
import foramtDate from '@/utils/formatDate'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
  const [selectedCourseId, setSelectedCourseId] = useState('-1')
  const {
    data: { courseList, activityList, updateAt },
    pos,
    refetch,
    isLoading,
  } = useGetContents({ enabled: isOpen })

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW="750px" h="500px" borderRadius="8px">
        <ModalHeader display="flex" alignItems="center" minH="60px" px="24px">
          <Text fontSize="18px" fontWeight="700">
            Gachon Tools
          </Text>
          <ModalCloseButton
            size="lg"
            top="16px"
            right="16px"
            border="none"
            outline="none !important"
            _hover={{ bg: 'none', color: 'inherit' }}
            _focus={{ bg: 'none', color: 'inherit' }}
            _active={{ bg: 'none' }}
            _focusVisible={{
              boxShadow: 'none',
            }}
          />
        </ModalHeader>
        <Divider m="0" />
        <ModalBody display="flex" p="0" overflow="hidden">
          <Stack spacing="16px" w="200px" p="24px" overflowY="scroll">
            {courseList.map(course => (
              <Text
                key={course.id}
                fontSize="14px"
                fontWeight={selectedCourseId === course.id ? '600' : '400'}
                _light={{ color: selectedCourseId === course.id ? 'blue.600' : 'gray.600' }}
                _dark={{ color: selectedCourseId === course.id ? 'blue.400' : 'gray.400' }}
                _hover={{
                  _light: { color: 'blue.600' },
                  _dark: { color: 'blue.400' },
                }}
                cursor="pointer"
                onClick={() => setSelectedCourseId(course.id)}
                noOfLines={1}
              >
                {course.title}
              </Text>
            ))}
          </Stack>

          <Divider orientation="vertical" m="0" />

          <Box flex="1" overflowY="scroll" px="24px" h="100%">
            <Tabs isLazy={true}>
              <TabList
                position="sticky"
                top="0"
                zIndex="1"
                _light={{ bg: 'white' }}
                _dark={{ bg: 'gray.700' }}
                pt="16px"
              >
                <Tab
                  fontSize="14px"
                  borderRadius="none"
                  border="none"
                  outline="none !important"
                  _hover={{
                    _dark: { bg: 'blue.800', color: 'white' },
                  }}
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
                  _hover={{
                    _dark: { bg: 'blue.800', color: 'white' },
                  }}
                  _focus={{ outline: 'none', bg: 'none', border: 'none' }}
                  _active={{ outline: 'none', bg: 'none' }}
                  _selected={{ color: 'blue.600', borderBottom: '2px solid' }}
                >
                  모든 과제
                </Tab>
              </TabList>

              <TabPanels as={AnimatePresence}>
                <TabPanel>
                  {isLoading ? (
                    <LoadingProgress pos={pos} />
                  ) : (
                    <ActivityList
                      contentData={filteredActivities(
                        activityList,
                        selectedCourseId,
                        '진행중인 과제',
                        false,
                      )}
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  {isLoading ? (
                    <LoadingProgress pos={pos} />
                  ) : (
                    <ActivityList
                      contentData={filteredActivities(
                        activityList,
                        selectedCourseId,
                        '모든 과제',
                        false,
                      )}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </ModalBody>

        <Divider m="0" />

        <ModalFooter h="60px" px="24px">
          <PopoverOptions
            triggerElement={
              <Center cursor="pointer">
                <SettingIcon
                  _light={{ color: 'gray.600' }}
                  _dark={{ color: 'gray.400' }}
                  mr="4px"
                />
                <Text fontSize="12px" _light={{ color: 'gray.600' }} _dark={{ color: 'gray.400' }}>
                  설정
                </Text>
              </Center>
            }
          />
          <Spacer />
          <Center cursor="pointer">
            <Text
              fontSize="12px"
              _light={{ color: 'gray.600' }}
              _dark={{ color: 'gray.400' }}
              mr="4px"
            >
              {isLoading ? '불러오는 중...' : `${foramtDate(ko, updateAt)} 업데이트`}
            </Text>
            <RefreshIcon
              _light={{ color: 'gray.600' }}
              _dark={{ color: 'gray.400' }}
              onClick={refetch}
            />
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContentModal
