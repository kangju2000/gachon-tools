import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'

export function App() {
  return (
    <ContentThemeProvider>
      <Trigger />
    </ContentThemeProvider>
  )
}
