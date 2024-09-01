import { TaskCard } from './TaskCard'
import type { ActivityType } from '@/types'

type TaskListProps = {
  tasks: ActivityType[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-10px">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
