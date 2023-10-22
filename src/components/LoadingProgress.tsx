import { Box, Flex, Progress, Text } from '@chakra-ui/react'

type Props = {
  pos: number
}

const LoadingProgress = ({ pos }: Props) => {
  return (
    <Box w="100%" mt="100px">
      <Flex justify="space-between" mb="4px">
        <Text fontSize="12px" _light={{ color: 'gray.500' }} _dark={{ color: 'gray.400' }}>
          과제를 불러오는 중입니다.
        </Text>
        <Text fontSize="12px" _light={{ color: 'gray.500' }} _dark={{ color: 'gray.400' }}>
          {pos}%
        </Text>
      </Flex>
      <Progress
        value={pos}
        borderRadius="16px"
        sx={{
          '& > div:first-of-type': {
            transitionProperty: 'width',
          },
        }}
        hasStripe
      />
    </Box>
  )
}

export default LoadingProgress
