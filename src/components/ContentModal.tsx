import {
  Box,
  Button,
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
  Text,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'

import CourseList from './CourseList'
import { RefreshIcon, SettingIcon } from './Icons'
import PopoverOptions from './PopoverOptions'
import TabContent from './TabContent'
import useGetContents from '@/hooks/useGetContents'
import { useShadowContext } from '@/pages/content/App'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
  const shadowRef = useShadowContext()
  const [selectedCourseId, setSelectedCourseId] = useState('-1')
  const {
    data: { courseList, activityList, updateAt },
    pos,
    refetch,
    isLoading,
  } = useGetContents({ enabled: isOpen })

  const updateAtDate = new Date(updateAt)

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      portalProps={{
        containerRef: shadowRef,
      }}
    >
      <ModalOverlay />
      <ModalContent
        minW={{
          base: '90%',
          md: '750px',
        }}
        h="500px"
        borderRadius="8px"
      >
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
            _focusVisible={{ boxShadow: 'none' }}
            _light={{ color: 'gray.600' }}
            _dark={{ color: 'gray.400' }}
          />
        </ModalHeader>
        <Divider m="0" />
        <ModalBody display="flex" p="0" overflow="hidden">
          <Box
            w="200px"
            h="100%"
            px="18px"
            py="24px"
            display={{ base: 'none', md: 'block' }}
            overflowY="scroll"
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <CourseList
              courseList={courseList}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
            />
          </Box>
          <Divider orientation="vertical" m="0" display={{ base: 'none', md: 'block' }} />
          <Box
            flex="1"
            overflowY="scroll"
            px="24px"
            h="100%"
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <TabContent
              activityList={activityList}
              selectedCourseId={selectedCourseId}
              pos={pos}
              isLoading={isLoading}
            />
          </Box>
        </ModalBody>

        <Divider m="0" />

        <ModalFooter h="50px" px="24px" userSelect="none">
          <PopoverOptions
            triggerElement={
              <Center
                as={Button}
                cursor="pointer"
                outline="none !important"
                bg="none"
                _hover={{ _light: { bg: 'none' }, _dark: { bg: 'none' } }}
                _focus={{ _light: { bg: 'none' }, _dark: { bg: 'none' } }}
                _active={{ _light: { bg: 'none' }, _dark: { bg: 'none' } }}
                border="none"
                p="6px"
              >
                <SettingIcon _light={{ color: 'gray.600' }} _dark={{ color: 'gray.400' }} mr="4px" />
                <Text fontSize="12px" fontWeight="500" _light={{ color: 'gray.600' }} _dark={{ color: 'gray.400' }}>
                  설정
                </Text>
              </Center>
            }
          />
          <Spacer />
          <Center cursor="pointer" onClick={refetch}>
            <Text fontSize="12px" _light={{ color: 'gray.600' }} _dark={{ color: 'gray.400' }} mr="4px">
              {isLoading
                ? '불러오는 중...'
                : `${
                    isValid(updateAtDate) && formatDistanceToNowStrict(updateAtDate, { addSuffix: true, locale: ko })
                  } 업데이트`}
            </Text>
            <RefreshIcon _light={{ color: 'gray.600' }} _dark={{ color: 'gray.400' }} />
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContentModal
