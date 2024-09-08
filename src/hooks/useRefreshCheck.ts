import { useEffect, useState } from 'react'

import { useStorage } from '@/context/storageContext'

export const useRefreshCheck = () => {
  const {
    data: { meta, settings },
    isLoading,
  } = useStorage()
  const [shouldRefresh, setShouldRefresh] = useState(false)

  useEffect(() => {
    if (!isLoading) return

    const lastUpdateTime = new Date(meta.updateAt).getTime()
    const currentTime = new Date().getTime()

    setShouldRefresh(currentTime - lastUpdateTime > settings.refreshInterval)
  }, [meta.updateAt, settings.refreshInterval, isLoading])

  return { shouldRefresh }
}
