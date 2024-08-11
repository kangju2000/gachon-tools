import { motion } from 'framer-motion'

type Props = {
  pos: number
}

const LoadingProgress = ({ pos }: Props) => {
  const circumference = 2 * Math.PI * 28 // 2πr, where r = 28 (the radius of our circle)
  const strokeDashoffset = circumference - (pos / 100) * circumference

  return (
    <div className="flex h-300px items-center justify-center">
      <motion.div
        className="relative h-60px w-60px"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="h-full w-full" viewBox="0 0 60 60">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="28"
            cx="30"
            cy="30"
          />
          <circle
            className="text-primary"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="28"
            cx="30"
            cy="30"
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-14px font-medium text-gray-700 dark:text-gray-200">{Math.round(pos)}%</span>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingProgress
