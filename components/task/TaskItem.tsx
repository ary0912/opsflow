"use client"

import { useState } from "react"
import axios from "axios"

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

interface TaskItemProps {
  task: Task
  onUpdate: (updatedTask: Task) => void
  onDelete: (taskId: string) => void
  token: string
}

export default function TaskItem({ task, onUpdate, onDelete, token }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editStatus, setEditStatus] = useState(task.status)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await axios.patch(
        `/api/tasks/${task.id}`,
        {
          title: editTitle,
          status: editStatus,
          priority: editPriority,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      onUpdate(res.data)
      setIsEditing(false)
    } catch (error) {
      console.error("Update task error:", error)
      // TODO: Add error handling/toast
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setLoading(true)
    try {
      await axios.delete(`/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onDelete(task.id)
    } catch (error) {
      console.error("Delete task error:", error)
      // TODO: Add error handling/toast
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await axios.patch(
        `/api/tasks/${task.id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      onUpdate(res.data)
    } catch (error) {
      console.error("Update status error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    setLoading(true)
    try {
      const res = await axios.patch(
        `/api/tasks/${task.id}`,
        { priority: newPriority },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      onUpdate(res.data)
    } catch (error) {
      console.error("Update priority error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl border-[3px] border-black bg-[#ffe66d] p-4 shadow-[3px_3px_0px_#000] flex flex-col gap-3 text-black">
        <div className="space-y-3">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-black/55 mb-1">
              Task Title
            </label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-[0.8rem] border-[2px] border-black bg-white px-3 py-2 text-sm font-semibold text-black outline-none shadow-[2px_2px_0px_#000] focus:translate-y-0 focus:shadow-none"
              disabled={loading}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-[9px] font-black uppercase tracking-wider text-black/55 mb-1">
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                disabled={loading}
                className="w-full rounded-[0.8rem] border-[2px] border-black bg-white px-2 py-1.5 text-xs font-black uppercase text-black cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-[9px] font-black uppercase tracking-wider text-black/55 mb-1">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                disabled={loading}
                className="w-full rounded-[0.8rem] border-[2px] border-black bg-white px-2 py-1.5 text-xs font-black uppercase text-black cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-[0.8rem] border-[2.5px] border-black bg-[#9cff57] px-4 py-2 text-xs font-black uppercase shadow-[2.5px_2.5px_0px_#000] active:translate-y-[1.5px] active:shadow-none hover:-translate-y-0.5 transition-all text-black"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="rounded-[0.8rem] border-[2.5px] border-black bg-[#ff8ad8] px-4 py-2 text-xs font-black uppercase shadow-[2.5px_2.5px_0px_#000] active:translate-y-[1.5px] active:shadow-none hover:-translate-y-0.5 transition-all text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    )
  }

  // Assign priority color tags
  const priorityColors: Record<string, string> = {
    high: "bg-[#ff6b6b]",
    medium: "bg-[#ffe66d]",
    low: "bg-[#7df9ff]",
  }
  const priorityColor = priorityColors[task.priority] || "bg-[#efe7da]"

  return (
    <li
      className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_#000] flex flex-col gap-3 text-black transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id)
        e.dataTransfer.effectAllowed = "move"
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <strong className="font-black uppercase text-sm tracking-tight text-black break-words leading-tight">{task.title}</strong>
          <span className={`rounded-full border-[2px] border-black ${priorityColor} px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-black shadow-[1.5px_1.5px_0px_#000]`}>
            {task.priority}
          </span>
        </div>

        {task.project && (
          <div className="mt-2.5">
            <span className="inline-flex rounded-full border-[2px] border-black bg-[#7df9ff] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0px_#000]">
              Proj: {task.project.name}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <div className="w-1/2">
            <label className="block text-[8px] font-black uppercase tracking-wider text-black/45 mb-0.5">Status</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-[0.6rem] border-[2px] border-black bg-[#efe7da] px-2 py-1 text-[10px] font-black uppercase text-black cursor-pointer shadow-[1.5px_1.5px_0px_#000] focus:translate-y-0"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-[8px] font-black uppercase tracking-wider text-black/45 mb-0.5">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-[0.6rem] border-[2px] border-black bg-[#efe7da] px-2 py-1 text-[10px] font-black uppercase text-black cursor-pointer shadow-[1.5px_1.5px_0px_#000] focus:translate-y-0"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2 pt-2 border-t-2 border-dashed border-black/5">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="rounded-[0.7rem] border-[2px] border-black bg-[#7df9ff] px-3 py-1.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all text-black"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-[0.7rem] border-[2px] border-black bg-[#ff6b6b] px-3 py-1.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all text-black"
        >
          Delete
        </button>
      </div>
    </li>
  )
}