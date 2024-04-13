import { chakra, shouldForwardProp, forwardRef, type ChakraProps } from '@chakra-ui/react'
import { isValidMotionProp, motion, type MotionProps } from 'framer-motion'

import type { ComponentPropsWithoutRef } from 'react'

const ChakraMotion = <C extends React.ElementType>(
  { as, children, ...props }: ComponentPropsWithoutRef<C> & { as?: C } & MotionProps & Omit<ChakraProps, 'transition'>,
  ref: React.ComponentPropsWithRef<C>['ref'],
) => {
  const Component = as || 'div'

  const MotionComponent = chakra(motion(Component), {
    shouldForwardProp: prop => isValidMotionProp(prop) || shouldForwardProp(prop),
  })

  return (
    <MotionComponent ref={ref} {...props}>
      {children}
    </MotionComponent>
  )
}

export default forwardRef(ChakraMotion)
