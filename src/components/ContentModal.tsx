import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { ko } from 'date-fns/locale'

import { RefreshIcon } from './Icons'

import foramtDate from '@/utils/formatDate'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ContentModal = ({ isOpen, onClose }: Props) => {
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
        <ModalBody>하이</ModalBody>
        <Divider m="0" />
        <ModalFooter h="60px" px="24px">
          <Text fontSize="12px" color="gray.600" mr="4px">
            {foramtDate(ko, new Date().toDateString())} 업데이트
          </Text>
          <RefreshIcon color="gray.600" />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContentModal
