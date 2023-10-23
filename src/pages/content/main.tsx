import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools'
import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'

import packageJson from './../../../package.json'

import App from '@/pages/content/App'

const { version } = packageJson

Sentry.init({
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: version,
  integrations: [
    new Sentry.Integrations.Breadcrumbs({ console: true }),
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

const root = document.createElement('div')
root.id = 'root'
document.body.append(root)

const modal = document.createElement('div')
modal.id = 'modal'
document.body.append(modal)

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        // 사이버캠퍼스 기본 설정 적용
        fontSize: '14px',
        lineHeight: '1.42857143',
        color: '#333',
      },
    },
  },
  components: {
    Text: {
      baseStyle: (props: StyleFunctionProps) => ({
        color: mode('gray.700', 'gray.200')(props),
        margin: 0,
        padding: 0,
      }),
    },
  },
})

createRoot(root).render(
  <>
    <ChakraProvider resetCSS={false} theme={theme}>
      <App />
    </ChakraProvider>
  </>,
)
