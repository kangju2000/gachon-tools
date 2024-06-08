import { ThemeConfig, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

export const customTheme = extendTheme(
  {
    config,
    components: {
      Text: {
        baseStyle: (props: StyleFunctionProps) => ({
          color: mode('gray.700', 'gray.200')(props),
          margin: 0,
          padding: 0,
        }),
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          default: '#2F6EA2',
        },
        modalBg: {
          default: 'white',
          _dark: 'gray.700',
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'gray' }),
)
