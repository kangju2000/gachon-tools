import { Box } from '@chakra-ui/react'

type Props = {
  pos: number
  max?: number
  borderRadius?: string
  height?: string
}

const ProgressBar = ({ pos, max = 100, borderRadius = '16px', height = '6px' }: Props) => {
  const percent = (pos / max) * 100

  return (
    <Box h={height} borderRadius={borderRadius} bg="gray.200">
      <Box
        h="100%"
        borderRadius={borderRadius}
        bg="#2F6EA2"
        transition="width 0.2s ease-in-out"
        style={{ width: `${percent}%` }}
      ></Box>
    </Box>
  )
}

export default ProgressBar
