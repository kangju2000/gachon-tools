import { Box, Flex, Progress, Text } from '@chakra-ui/react'

type Props = {
  pos: number
}

const LoadingProgress = ({ pos }: Props) => {
  return (
    <Box w="100%" mt="100px">
      <Flex justify="space-between">
        <Text>과제를 불러오는 중입니다.</Text>
        <Text>{pos}%</Text>
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
