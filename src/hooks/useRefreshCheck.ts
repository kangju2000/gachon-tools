import { useEffect, useState } from 'react'

import { useStorageStore } from '@/storage/useStorageStore'

export const useRefreshCheck = () => {
  const { meta, settings } = useStorageStore()
  const [shouldRefresh, setShouldRefresh] = useState(false)

  useEffect(() => {
    const lastUpdateTime = new Date(meta.updateAt).getTime()
    const currentTime = new Date().getTime()

    setShouldRefresh(currentTime - lastUpdateTime > settings.refreshInterval)
  }, [meta.updateAt, settings.refreshInterval])

  return { shouldRefresh }
}
