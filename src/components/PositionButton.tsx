import { Box, Image } from '@chakra-ui/react'
import { useMotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'

import ChakraMotion from './ChakraMotion'

type Props = {
  onClick: () => void
}

const PositionButton = ({ onClick }: Props) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const ref = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const onPointChange = (point: { x: number; y: number }) => {
    chrome.storage.local.set({ point })
    x.set(point.x)
    y.set(point.y)
  }

  useEffect(() => {
    chrome.storage.local.get(({ point }) => {
      if (point) {
        x.set(point.x)
        y.set(point.y)

        return
      }

      chrome.storage.local.set({ point: { x: 0, y: 0 } })
      x.set(0)
      y.set(0)
    })
  }, [])

  return (
    <ChakraMotion
      as={Box}
      pos="fixed"
      w="100vw"
      h="100vh"
      top="0px"
      left="0px"
      ref={ref}
      pointerEvents="none"
      zIndex={1050}
    >
      <ChakraMotion
        as={Image}
        src={chrome.runtime.getURL('/assets/christmas.png')}
        drag
        dragConstraints={ref}
        dragElastic={0.1}
        dragMomentum={false}
        whileDrag={{ scale: 1.02, opacity: 0.6 }}
        onDragStart={() => {
          isDragging.current = true
        }}
        onDragEnd={() => {
          isDragging.current = false
          const { x, y } = ref.current.children[0].getBoundingClientRect()
          onPointChange({ x, y })
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        position="absolute"
        w="100px"
        h="100px"
        style={{
          x,
          y,
        }}
        cursor="pointer"
        pointerEvents="auto"
        onClick={() => {
          if (!isDragging.current) onClick()
        }}
      />
    </ChakraMotion>
  )
}

export default PositionButton
