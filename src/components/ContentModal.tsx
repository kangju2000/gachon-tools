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
  useColorModeValue,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useMemo, useState } from 'react'

import CourseList from './CourseList'
import { RefreshIcon, SettingIcon } from './Icons'
import PopoverOptions from './PopoverOptions'
import TabContent from './TabContent'
import { useRootRefContext } from '@/components/ShadowChakraProvider'
import useGetContents from '@/hooks/useGetContents'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
  const rootRef = useRootRefContext()
  const [selectedCourseId, setSelectedCourseId] = useState('-1')
  const {
    data: { courseList, activityList, updateAt },
    pos,
    refetch,
    isLoading,
  } = useGetContents({ enabled: isOpen })
  const color = useColorModeValue('gray.600', 'gray.400')

  const loadingText = useMemo(() => {
    if (isLoading) {
      return '불러오는 중...'
    }

    const updateAtDate = new Date(updateAt)
    if (!isValid(updateAtDate)) {
      return '업데이트 날짜 없음'
    }

    const time = formatDistanceToNowStrict(updateAtDate, { addSuffix: true, locale: ko })
    return `${time} 업데이트`
  }, [isLoading, updateAt])

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} portalProps={{ containerRef: rootRef }}>
      <ModalOverlay />
      <ModalContent
        minW={{ base: '90%', md: '750px' }}
        h="500px"
        borderRadius="8px"
        bg="modalBg"
        sx={{
          '*::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <ModalHeader display="flex" alignItems="center" minH="60px" px="24px">
          <Text fontSize="18px" fontWeight="700">
            Gachon Tools
          </Text>
          <ModalCloseButton size="lg" top="16px" right="16px" _focusVisible={{ boxShadow: 'none' }} color={color} />
        </ModalHeader>
        <Divider />
        <ModalBody display="flex" p="0" overflow="hidden">
          <Box w="200px" h="100%" px="18px" py="24px" display={{ base: 'none', md: 'block' }} overflowY="scroll">
            <CourseList
              courseList={courseList}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
            />
          </Box>
          <Divider orientation="vertical" display={{ base: 'none', md: 'block' }} />
          <Box flex="1" overflowY="scroll" px="24px" h="100%">
            <TabContent
              activityList={activityList}
              selectedCourseId={selectedCourseId}
              pos={pos}
              isLoading={isLoading}
            />
          </Box>
        </ModalBody>

        <Divider />

        <ModalFooter h="50px" px="24px">
          <PopoverOptions
            triggerElement={
              <Center as={Button} cursor="pointer" bg="none" p="6px">
                <SettingIcon mr="4px" color={color} />
                <Text fontSize="12px" fontWeight="500" color={color}>
                  설정
                </Text>
              </Center>
            }
          />
          <Spacer />
          <Center cursor="pointer" onClick={refetch}>
            <Text fontSize="12px" color={color} mr="4px">
              {loadingText}
            </Text>
            <RefreshIcon color={color} />
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContentModal
