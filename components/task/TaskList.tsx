"use client"

import TaskItem from "./TaskItem"

interface Task {
  id: string
  title: string
  status: string
  priority: string
}

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (updatedTask: Task) => void
  onDeleteTask: (taskId: string) => void
  token: string
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, token }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No tasks found. Create your first task above!
      </div>
    )
  }

  return (
    <ul className="mt-6">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          token={token}
        />
      ))}
    </ul>
  )
}