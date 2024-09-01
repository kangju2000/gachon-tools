import { motion } from 'framer-motion'
type LoadingSkeletonProps = {
  progress: number
}

export function LoadingSkeleton({ progress }: LoadingSkeletonProps) {
  return (
    <div className="space-y-16px">
      <div className="mb-16px h-4px w-full rounded-full bg-gray-200">
        <motion.div
          className="h-4px rounded-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="d-skeleton h-80px w-full"></div>
      ))}
    </div>
  )
}
