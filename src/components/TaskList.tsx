import { TaskCard } from './TaskCard'
import type { ActivityType } from '@/types'

type TaskListProps = {
  tasks: ActivityType[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-10px">
      {tasks.map((task, index) => {
        // id가 존재하지 않는 경우, 링크가 활성화되어있지 않지만 과제가 예정되어 있다는 의미
        if (task.id === '') {
          return null
        }

        return <TaskCard key={index} task={task} />
      })}
    </div>
  )
}
