import { useDisclosure } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import ChatIcon from '/public/logo128.png'

import { useHotkeys } from 'react-hotkeys-hook'

import ContentModal from '@/components/ContentModal'

export default function Trigger() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // 단축키 설정: Ctrl+/ 또는 Command+/ 누르면 모달 창 열기/닫기 토글
  useHotkeys('ctrl+/, meta+/', () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  })

  return (
    <>
      {/* AnimatePresence를 사용하여 애니메이션을 적용 */}
      <AnimatePresence>
        {!isOpen && (
          <div
            className="chat-button"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onClick={onOpen}
          >
            <img src={ChatIcon} alt="Chat Icon" style={{ width: '60px', height: '60px' }} />
          </div>
        )}
      </AnimatePresence>

      {/* isOpen 상태에 따라 모달 창을 렌더링 */}
      <ContentModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
