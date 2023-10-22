import {
  Checkbox,
  Divider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react'

import packageJson from '../../package.json'

const { version } = packageJson

type Props = {
  triggerElement: React.ReactNode
}

const PopoverOptions = ({ triggerElement }: Props) => {
  const { colorMode, setColorMode } = useColorMode()

  console.log(colorMode)

  return (
    <Popover placement="top-start">
      <PopoverTrigger>{triggerElement}</PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow />
        <PopoverHeader p="8px" fontWeight="700">
          설정
        </PopoverHeader>
        <PopoverCloseButton
          border="none"
          size="md"
          top="8px"
          right="4px"
          outline="none !important"
        />
        <Divider m="0" />
        <PopoverBody p="12px">
          <Stack spacing={5} direction="row">
            <Text>다크모드 :</Text>
            <Checkbox
              m="0"
              size="lg"
              isChecked={colorMode === 'light'}
              onChange={e => setColorMode('light')}
            >
              Light
            </Checkbox>
            <Checkbox
              m="0"
              size="lg"
              isChecked={colorMode === 'dark'}
              onChange={e => setColorMode('dark')}
            >
              Dark
            </Checkbox>
          </Stack>
        </PopoverBody>
        <PopoverFooter>
          <Text textAlign="end" fontSize="12px" color="gray.500">
            ver.{version}
          </Text>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverOptions
