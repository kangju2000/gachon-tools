import { useEffect } from 'react'

import { useContentsFetcher } from './useContentsFetcher'
import { useRefreshCheck } from './useRefreshCheck'
import { useStorage } from '@/context/storageContext'

export const useContents = () => {
  const {
    data: { contents },
  } = useStorage()
  const { shouldRefresh } = useRefreshCheck()
  const { fetchContents, isLoading, progress } = useContentsFetcher()

  useEffect(() => {
    if (shouldRefresh || !contents.courseList.length) {
      fetchContents()
    }
  }, [shouldRefresh, contents.courseList.length])

  return {
    contents,
    isLoading,
    progress,
    refetch: fetchContents,
  }
}
