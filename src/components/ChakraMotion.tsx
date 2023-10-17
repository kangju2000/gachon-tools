import { type ChakraProps, chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion, type MotionProps } from 'framer-motion'

import type { ComponentPropsWithoutRef } from 'react'

const ChakraMotion = <C extends React.ElementType>({
  as,
  children,
  ...props
}: ComponentPropsWithoutRef<C> & { as?: C } & MotionProps & Omit<ChakraProps, 'transition'>) => {
  const Component = as || 'div'

  const MotionComponent = chakra(motion(Component), {
    shouldForwardProp: prop => isValidMotionProp(prop) || shouldForwardProp(prop),
  })

  return <MotionComponent {...props}>{children}</MotionComponent>
}

export default ChakraMotion
