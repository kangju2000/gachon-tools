import { useState } from 'react'

const useError = () => {
  const [error, setError] = useState<Error | null>(null)

  const catchAsyncError = (error: Error) => {
    setError(error)
  }

  return { error, catchAsyncError }
}

export default useError
