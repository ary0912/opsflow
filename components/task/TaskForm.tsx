"use client"

import { useState } from "react"
import axios from "axios"

interface TaskFormProps {
  onTaskCreated: () => void
  token: string
  projectId?: string
}

export default function TaskForm({ onTaskCreated, token, projectId }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await axios.post(
        "/api/tasks",
        { title: title.trim(), status, priority, projectId: projectId || undefined },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setTitle("")
      setStatus("todo")
      setPriority("medium")
      onTaskCreated()
    } catch (error) {
      console.error("Create task error:", error)
      // TODO: Add error handling/toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="flex-1 rounded-[1.2rem] border-[3px] border-black bg-[#f6f0e4] px-4 py-3.5 text-sm font-semibold text-black placeholder:text-zinc-500 focus:bg-white focus:shadow-[4px_4px_0px_#000] focus:-translate-y-0.5 outline-none transition-all"
          disabled={loading}
          required
        />
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
            className="rounded-[1.2rem] border-[3px] border-black bg-white px-4 py-3.5 text-xs font-black uppercase tracking-wider text-black cursor-pointer shadow-[3px_3px_0px_#000] outline-none"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
            className="rounded-[1.2rem] border-[3px] border-black bg-white px-4 py-3.5 text-xs font-black uppercase tracking-wider text-black cursor-pointer shadow-[3px_3px_0px_#000] outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="rounded-[1.2rem] border-[3px] border-black bg-[#9cff57] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_#000] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Adding..." : "+ Add"}
          </button>
        </div>
      </div>
    </form>
  )
}