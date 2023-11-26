import { Center, Flex, Link, Text, Tooltip } from '@chakra-ui/react'

import { FeedbackIcon, GachonLogoIcon, GithubIcon, NotionIcon } from '@/components/Icons'

function App() {
  return (
    <Center flexDirection="column" h="250px" w="250px" bg="white" p="10px">
      <GachonLogoIcon w="50px" h="50px" />
      <Text as="h1" fontSize="24px" fontWeight="bold">
        Gachon Tools
      </Text>
      <Text fontSize="14px">가천대학교 사이버캠퍼스 확장 프로그램</Text>
      <div className="flex-grow"></div>
      <Flex gap="5px" mt="10px">
        <Tooltip label="깃허브">
          <Link
            href="https://www.github.com/kangju2000/gachon-extension"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon cursor="pointer" />
          </Link>
        </Tooltip>
        <Tooltip label="피드백">
          <Link href="https://forms.gle/uM8M6ghS2ABme5s5A" target="_blank" rel="noreferrer">
            <FeedbackIcon cursor="pointer" />
          </Link>
        </Tooltip>
        <Tooltip label="노션">
          <Link
            href="https://kangju2000.notion.site/Gachon-Tools-f01d077db229434abfce605c2d26f682?pvs=4"
            target="_blank"
            rel="noreferrer"
          >
            <NotionIcon cursor="pointer" />
          </Link>
        </Tooltip>
      </Flex>
    </Center>
  )
}

export default App
