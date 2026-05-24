"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BoltIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
} from "@heroicons/react/24/outline"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"
import RequireAuth from "@/components/auth/RequireAuth"
import StatCard from "@/components/ui/StatCard"
import { clearAuthToken } from "@/lib/authClient"

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate?: string | null
}

interface Workflow {
  id: string
  isActive: boolean
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      clearAuthToken()
      router.replace("/login")
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    try {
      const [taskRes, workflowRes, projectRes] = await Promise.all([
        fetch("/api/tasks", { headers }),
        fetch("/api/workflows", { headers }),
        fetch("/api/projects", { headers }),
      ])

      if ([taskRes, workflowRes, projectRes].some((r) => r.status === 401)) {
        clearAuthToken()
        router.replace("/login")
        return
      }

      if (!taskRes.ok || !workflowRes.ok || !projectRes.ok) {
        setError("Unable to load dashboard")
        return
      }

      const [taskData, workflowData, projectData] = await Promise.all([
        taskRes.json(),
        workflowRes.json(),
        projectRes.json(),
      ])

      setTasks(Array.isArray(taskData) ? taskData : [])
      setWorkflows(Array.isArray(workflowData) ? workflowData : [])
      setProjectCount(Array.isArray(projectData) ? projectData.length : 0)
    } catch (err) {
      console.error(err)
      setError("Unable to load dashboard")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "done").length
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== "done"
    }).length
    const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done").length
    const activeWorkflows = workflows.filter((w) => w.isActive).length
    const inProgress = tasks.filter((t) => t.status === "in_progress").length

    return {
      total: tasks.length,
      completed,
      overdue,
      highPriority,
      activeWorkflows,
      inProgress,
      completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    }
  }, [tasks, workflows])

  const insights = useMemo(() => {
    const items: string[] = []
    if (counts.overdue > 0) items.push(`${counts.overdue} overdue`)
    if (counts.highPriority > 0) items.push(`${counts.highPriority} high priority`)
    if (counts.activeWorkflows > 0) items.push(`${counts.activeWorkflows} automations live`)
    if (items.length === 0) items.push("All clear — nothing urgent")
    return items
  }, [counts])

  const recentTasks = useMemo(
    () => tasks.filter((t) => t.status !== "done").slice(0, 5),
    [tasks]
  )

  const linkBtn =
    "rounded-xl border-[3px] border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:bg-[#ffe66d]"

  if (loading) {
    return (
      <RequireAuth>
        <Sidebar>
          <PageShell className="flex min-h-[50vh] items-center justify-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          </PageShell>
        </Sidebar>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <Sidebar>
        <PageShell className="p-4 sm:p-6">
          <PageHeader
            title="Dashboard"
            description="Live snapshot of tasks, projects, and automations."
            actions={
              <>
                <Link href="/tasks" className={linkBtn}>
                  Tasks
                </Link>
                <Link href="/workflows" className={`${linkBtn} bg-[#7df9ff]`}>
                  Workflows
                </Link>
              </>
            }
          />

          {error && (
            <p className="mb-4 rounded-xl border-2 border-black bg-[#ff8ad8] px-4 py-2 text-sm font-semibold">
              {error}
            </p>
          )}

          <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Tasks"
              value={counts.total}
              color="#7df9ff"
              icon={ClipboardDocumentListIcon}
              hint={`${counts.inProgress} in progress`}
            />
            <StatCard
              label="Done"
              value={`${counts.completionRate}%`}
              color="#9cff57"
              icon={CheckCircleIcon}
              hint={`${counts.completed} completed`}
            />
            <StatCard
              label="Automations"
              value={counts.activeWorkflows}
              color="#ff8ad8"
              icon={BoltIcon}
            />
            <StatCard
              label="Projects"
              value={projectCount}
              color="#ffe66d"
              icon={FolderIcon}
            />
          </section>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0px_#000]">
              <h2 className="text-sm font-black uppercase tracking-wide text-black/50">
                Active work
              </h2>
              {recentTasks.length === 0 ? (
                <p className="mt-4 text-sm text-black/45">No open tasks. Add some from Tasks.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {recentTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-xl border-2 border-black/10 bg-[#f6f0e4]/50 px-3 py-2.5"
                    >
                      <span className="truncate text-sm font-semibold">{task.title}</span>
                      <span className="shrink-0 rounded-full border border-black bg-white px-2 py-0.5 text-[9px] font-black uppercase">
                        {task.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/tasks"
                className="mt-4 inline-block text-xs font-bold uppercase text-black/50 hover:text-black"
              >
                View all tasks →
              </Link>
            </section>

            <section className="rounded-2xl border-[3px] border-black bg-[#111111] p-5 text-white shadow-[6px_6px_0px_#000]">
              <h2 className="text-sm font-black uppercase tracking-wide text-white/50">
                Status
              </h2>
              <ul className="mt-4 space-y-3">
                {insights.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border-2 border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {counts.overdue > 0 && (
                <Link
                  href="/tasks"
                  className="mt-4 block rounded-xl border-2 border-black bg-[#ff8ad8] px-3 py-2 text-center text-xs font-black uppercase text-black"
                >
                  Review overdue
                </Link>
              )}
            </section>
          </div>
        </PageShell>
      </Sidebar>
    </RequireAuth>
  )
}
