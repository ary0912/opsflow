"use client"

import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { clearAuthToken } from "@/lib/authClient"
import TaskColumn from "./TaskColumn"
import TaskForm from "./TaskForm"

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

interface Project {
  id: string
  name: string
  tasks: Task[]
  _count: {
    tasks: number
  }
}

export interface TaskFilters {
  status: string
  priority: string
}

interface KanbanBoardProps {
  projectId?: string
  token: string
  filters?: TaskFilters
  refreshKey?: number
  formAnchorId?: string
}

export default function KanbanBoard({
  projectId,
  token,
  filters = { status: "", priority: "" },
  refreshKey = 0,
  formAnchorId = "quick-task-form",
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>(projectId || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [workflowCount, setWorkflowCount] = useState(0)

  const handleUnauthorized = () => {
    clearAuthToken()
    window.location.href = "/login"
  }

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError("")

    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      let url = "/api/tasks"
      const queryParams: string[] = []
      if (selectedProject) queryParams.push(`projectId=${selectedProject}`)
      if (queryParams.length > 0) url += `?${queryParams.join("&")}`

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(res.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized()
        return
      }
      const message = axios.isAxiosError(err) && err.response?.data?.error
        ? err.response.data.error
        : "Failed to fetch tasks"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [selectedProject, token, refreshKey])

  const fetchProjects = useCallback(async () => {
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      const res = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(res.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized()
        return
      }
      console.error("Failed to fetch projects:", err)
    }
  }, [token])

  const fetchWorkflowCount = useCallback(async () => {
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      const res = await axios.get("/api/workflows", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const workflows = res.data as Array<{ isActive: boolean }>
      setWorkflowCount(Array.isArray(workflows) ? workflows.filter((workflow) => workflow.isActive).length : 0)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized()
        return
      }
      console.error("Failed to fetch workflow count:", err)
    }
  }, [token])

  useEffect(() => {
    fetchProjects()
    fetchWorkflowCount()
  }, [fetchProjects, fetchWorkflowCount])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleTaskCreated = () => {
    fetchTasks()
    setMessage("Task created successfully!")
    window.setTimeout(() => setMessage(""), 3000)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setMessage("Task updated successfully!")
    window.setTimeout(() => setMessage(""), 3000)
  }

  const handleDropTask = async (taskId: string, newStatus: string) => {
    // optimistic update
    const prev = tasks
    setTasks((t) => t.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    try {
      await axios.patch(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage("Task moved")
      window.setTimeout(() => setMessage(""), 2500)
    } catch (err) {
      console.error("Failed to move task:", err)
      setTasks(prev)
      setError("Failed to move task")
    }
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setMessage("Task deleted successfully!")
    window.setTimeout(() => setMessage(""), 3000)
  }

  const handleCreateProject = async () => {
    const projectName = prompt("Enter project name:")
    if (!projectName?.trim()) return

    try {
      await axios.post(
        "/api/projects",
        { name: projectName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProjects()
      setMessage("Project created successfully!")
      window.setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      console.error("Failed to create project:", err)
      setError("Failed to create project")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    return true
  })

  const totalTasks = filteredTasks.length
  const totalProjects = projects.length

  if (loading && totalTasks === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-[1.2rem] border-[3px] border-black bg-[#7df9ff] p-3 text-center shadow-[3px_3px_0px_#000] text-black">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Tasks</p>
            <p className="mt-1 text-2xl font-black">{totalTasks}</p>
          </div>
          <div className="rounded-[1.2rem] border-[3px] border-black bg-[#ffe66d] p-3 text-center shadow-[3px_3px_0px_#000] text-black">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Projects</p>
            <p className="mt-1 text-2xl font-black">{totalProjects}</p>
          </div>
          <div className="rounded-[1.2rem] border-[3px] border-black bg-[#9cff57] p-3 text-center shadow-[3px_3px_0px_#000] text-black">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Workflows</p>
            <p className="mt-1 text-2xl font-black">{workflowCount}</p>
          </div>
      </div>

      {message && (
        <div className="mb-6 rounded-[1.5rem] border-[3px] border-black bg-[#9cff57] p-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">{message}</div>
      )}
      {error && (
        <div className="mb-6 rounded-[1.5rem] border-[3px] border-black bg-[#ff8ad8] p-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">{error}</div>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] mb-8 text-black">
        <div
          id={formAnchorId}
          className="scroll-mt-6 rounded-2xl border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_#000]"
        >
          <h2 className="text-sm font-black uppercase text-black/50">New task</h2>
          <p className="mt-1 text-sm text-black/60">Add tasks quickly with status and priority assigned up front.</p>
          <TaskForm onTaskCreated={handleTaskCreated} token={token} projectId={selectedProject} />
        </div>
        <div className="rounded-2xl border-[3px] border-black bg-[#ffe66d] p-5 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase text-black">Project filter</h2>
              <p className="mt-1 text-sm text-black/70">Filter tasks by project or create one instantly.</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="rounded-2xl border-[3px] border-black bg-white px-5 py-3 text-xs font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-y-[1px]"
            >
              New project
            </button>
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-4 w-full rounded-[1.2rem] border-[3px] border-black bg-white px-4 py-3 text-sm font-semibold text-black outline-none shadow-[4px_4px_0px_#000] focus:shadow-[5px_5px_0px_#7df9ff] focus:-translate-y-0.5 transition-all"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project._count.tasks})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-[980px]">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={filteredTasks}
            onUpdateTask={handleTaskUpdated}
            onDeleteTask={handleTaskDeleted}
            token={token}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="In Progress"
            status="in_progress"
            tasks={filteredTasks}
            onUpdateTask={handleTaskUpdated}
            onDeleteTask={handleTaskDeleted}
            token={token}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={filteredTasks}
            onUpdateTask={handleTaskUpdated}
            onDeleteTask={handleTaskDeleted}
            token={token}
            onDropTask={handleDropTask}
          />
        </div>
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="rounded-[2.5rem] border-[4px] border-dashed border-black bg-white p-12 text-center text-black shadow-[8px_8px_0px_#000]">
          <p className="text-xl font-black uppercase">No tasks found</p>
          <p className="mt-2 text-black/60">Create a new task above to populate your Kanban board.</p>
        </div>
      )}
    </div>
  )
}
