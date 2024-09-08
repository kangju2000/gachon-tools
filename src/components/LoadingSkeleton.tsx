import { motion } from 'framer-motion'

type LoadingSkeletonProps = {
  progress: number
}

export function LoadingSkeleton({ progress }: LoadingSkeletonProps) {
  return (
    <div className="space-y-16px">
      <motion.div
        className="mb-16px h-2px w-full overflow-hidden bg-blue-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="rounded-12px bg-white p-12px shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="mb-8px flex items-center gap-8px">
            <div className="h-20px w-40px animate-pulse rounded-8px bg-gray-200" />
            <div className="h-16px flex-1 animate-pulse rounded-4px bg-gray-200" />
          </div>
          <div className="mb-4px h-12px w-2/3 animate-pulse rounded-4px bg-gray-200" />
          <div className="flex items-center justify-between">
            <div className="h-10px w-20px animate-pulse rounded-4px bg-gray-200" />
            <div className="h-20px w-60px animate-pulse rounded-8px bg-gray-200" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
