import {
  Checkbox,
  Divider,
  Kbd,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
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

  return (
    <Popover placement="top-start">
      <PopoverTrigger>{triggerElement}</PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow />
        <PopoverHeader p="8px" fontWeight="700" _light={{ color: 'gray.700' }} _dark={{ color: 'gray.200' }}>
          설정
        </PopoverHeader>
        <PopoverCloseButton
          border="none"
          size="md"
          top="8px"
          right="4px"
          outline="none !important"
          _light={{ color: 'gray.600' }}
          _dark={{ color: 'gray.400' }}
        />
        <Divider m="0" />
        <PopoverBody p="12px">
          <Stack spacing={5} direction="row" fontSize="12px" mb="8px">
            <Text>테마 :</Text>
            <Checkbox m="0" size="lg" isChecked={colorMode === 'light'} onChange={() => setColorMode('light')}>
              <Text>Light</Text>
            </Checkbox>
            <Checkbox m="0" size="lg" isChecked={colorMode === 'dark'} onChange={() => setColorMode('dark')}>
              <Text>Dark</Text>
            </Checkbox>
          </Stack>
          <Stack spacing={5} direction="row" fontSize="12px">
            <Text>단축키 :</Text>
            <Text>
              <Kbd _light={{ color: 'gray.600' }} _dark={{ color: 'gray.600' }}>
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </Kbd>
              {' + '}
              <Kbd _light={{ color: 'gray.600' }} _dark={{ color: 'gray.600' }}>
                /
              </Kbd>
            </Text>
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
