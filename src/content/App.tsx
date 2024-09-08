import { Trigger } from './components/Trigger'
import { ContentThemeProvider } from '@/components/ContentThemeProvider'
import { StorageProvider } from '@/context/storageContext'

export function App() {
  return (
    <ContentThemeProvider>
      <StorageProvider>
        <Trigger />
      </StorageProvider>
    </ContentThemeProvider>
  )
}
