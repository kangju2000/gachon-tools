import { ErrorBoundary } from 'react-error-boundary'

import { ErrorFallback } from './components/ErrorFallback'
import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'

export function App() {
  return (
    <ContentThemeProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Trigger />
      </ErrorBoundary>
    </ContentThemeProvider>
  )
}
