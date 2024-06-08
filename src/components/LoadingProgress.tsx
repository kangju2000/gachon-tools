import { Center, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

type Props = {
  pos: number
}

const LoadingProgress = ({ pos }: Props) => {
  return (
    <Center h="300px">
      <CircularProgress value={pos} color="primary" display="flex" alignItems="center">
        <CircularProgressLabel _light={{ color: 'gray.700' }} _dark={{ color: 'gray.200' }}>
          {Math.round(pos)}%
        </CircularProgressLabel>
      </CircularProgress>
    </Center>
  )
}

export default LoadingProgress
