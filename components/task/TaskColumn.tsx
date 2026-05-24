"use client"

import TaskItem from "./TaskItem"

interface Task {
  id: string
  title: string
  status: string
  priority: string
  project?: {
    id: string
    name: string
  } | null
}

interface TaskColumnProps {
  title: string
  status: string
  tasks: Task[]
  onUpdateTask: (updatedTask: Task) => void
  onDeleteTask: (taskId: string) => void
  token: string
  onDropTask?: (taskId: string, newStatus: string) => void
}

export default function TaskColumn({
  title,
  status,
  tasks,
  onUpdateTask,
  onDeleteTask,
  token,
  onDropTask
}: TaskColumnProps) {
  const columnTasks = tasks.filter(task => task.status === status)

  // Assign column-specific accent colors for the counts
  const badgeColors: Record<string, string> = {
    todo: "bg-[#ffe66d]",
    in_progress: "bg-[#ff8ad8]",
    done: "bg-[#9cff57]"
  }
  const badgeColor = badgeColors[status] || "bg-[#7df9ff]"

  return (
    <div
      className="bg-[#f6f0e4] rounded-[2rem] border-[3px] border-black p-5 min-h-[450px] w-80 shadow-[4px_4px_0px_#000]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const id = e.dataTransfer.getData("text/plain")
        if (id && onDropTask) onDropTask(id, status)
      }}
    >
      <div className="flex items-center justify-between mb-5 pb-2 border-b-2 border-black/10">
        <h3 className="font-black uppercase tracking-wider text-black text-base">{title}</h3>
        <span className={`rounded-full border-[2px] border-black ${badgeColor} px-3 py-1 text-[10px] font-black shadow-[2px_2px_0px_#000] text-black`}>
          {columnTasks.length}
        </span>
      </div>

      <ul className="space-y-3">
        {columnTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            token={token}
          />
        ))}

        {columnTasks.length === 0 && (
          <div className="text-center text-black/45 py-12 font-black uppercase text-xs tracking-wider border-2 border-dashed border-black/10 rounded-2xl">
            Empty {title.toLowerCase()}
          </div>
        )}
      </ul>
    </div>
  )
}