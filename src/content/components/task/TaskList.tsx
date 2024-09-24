import { TaskCard } from './TaskCard'
import type { Activity } from '@/types'

type TaskListProps = {
  tasks: Activity[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-center text-14px text-gray-500">과제가 없습니다.</div>
  }

  return (
    <div className="space-y-10px">
      {tasks.map((task, index) => {
        return <TaskCard key={index} task={task} />
      })}
    </div>
  )
}
