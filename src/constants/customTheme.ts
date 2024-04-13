import { ThemeConfig, extendTheme } from '@chakra-ui/react'
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

export const customTheme = extendTheme({
  config,
  components: {
    Text: {
      baseStyle: (props: StyleFunctionProps) => ({
        color: mode('gray.700', 'gray.200')(props),
        margin: 0,
        padding: 0,
      }),
    },
    Divider: {
      baseStyle: (props: StyleFunctionProps) => ({
        borderColor: mode('gray.200', 'gray.700')(props),
      }),
    },
  },
})
