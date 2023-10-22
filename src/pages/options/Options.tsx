import { Box } from '@chakra-ui/react'

import packageJson from '../../../package.json'

const { version } = packageJson

function Options() {
  return (
    <Box>
      <h1>Options</h1>
      <p>Version: {version}</p>
    </Box>
  )
}

export default Options
