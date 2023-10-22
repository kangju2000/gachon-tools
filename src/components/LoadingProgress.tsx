import { Center, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

type Props = {
  pos: number
}

const LoadingProgress = ({ pos }: Props) => {
  return (
    <Center h="300px">
      <CircularProgress value={pos} color="#2F6EA2" display="flex" alignItems="center">
        <CircularProgressLabel>{pos}%</CircularProgressLabel>
      </CircularProgress>
    </Center>
  )
}

export default LoadingProgress
