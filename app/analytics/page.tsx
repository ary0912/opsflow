"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowPathIcon,
  BoltIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"
import RequireAuth from "@/components/auth/RequireAuth"
import StatCard from "@/components/ui/StatCard"
import { clearAuthToken } from "@/lib/authClient"

interface ActivityLog {
  id: string
  action: string
  entityType: string
  details: Record<string, unknown>
  userId: string
  createdAt: string
}

interface AnalyticsData {
  totalActivities: number
  completedTasks: number
  workflowTriggers: number
  activeUsers: number
  totalTasks: number
  overdueTasks: number
  activeWorkflows: number
  recentActivities: ActivityLog[]
}

const initialData: AnalyticsData = {
  totalActivities: 0,
  completedTasks: 0,
  workflowTriggers: 0,
  activeUsers: 0,
  totalTasks: 0,
  overdueTasks: 0,
  activeWorkflows: 0,
  recentActivities: [],
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token") || "public"

    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [activityRes, taskRes, workflowRes] = await Promise.all([
        fetch("/api/activities?limit=50", { headers }),
        fetch("/api/tasks", { headers }),
        fetch("/api/workflows", { headers }),
      ])

      if ([activityRes, taskRes, workflowRes].some((r) => r.status === 401)) {
        clearAuthToken()
        router.replace("/login")
        return
      }

      if (!activityRes.ok || !taskRes.ok || !workflowRes.ok) {
        setError("Unable to load analytics")
        return
      }

      const [activities, tasks, workflows] = await Promise.all([
        activityRes.json(),
        taskRes.json(),
        workflowRes.json(),
      ])

      const currentTasks = Array.isArray(tasks)
        ? (tasks as Array<{ status: string; dueDate?: string | null }>)
        : []
      const completedTasks = currentTasks.filter((t) => t.status === "done").length
      const overdueTasks = currentTasks.filter((t) => {
        if (!t.dueDate) return false
        return new Date(t.dueDate) < new Date() && t.status !== "done"
      }).length
      const activeWorkflows = Array.isArray(workflows)
        ? workflows.filter((w: { isActive: boolean }) => w.isActive).length
        : 0
      const activityList = Array.isArray(activities) ? (activities as ActivityLog[]) : []

      setData({
        totalActivities: activityList.length,
        completedTasks,
        workflowTriggers: activityList.filter((a) => a.action === "WORKFLOW_TRIGGERED").length,
        activeUsers: new Set(activityList.map((a) => a.userId)).size || 1,
        totalTasks: currentTasks.length,
        overdueTasks,
        activeWorkflows,
        recentActivities: activityList.slice(0, 12),
      })
    } catch (err) {
      console.error(err)
      setError("Unable to load analytics")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchAnalytics()
    const id = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(id)
  }, [fetchAnalytics])

  const efficiencyScore = useMemo(() => {
    if (data.totalTasks === 0) return 0
    return Math.min(100, Math.round((data.completedTasks / data.totalTasks) * 100))
  }, [data.completedTasks, data.totalTasks])

  const formatActivity = (activity: ActivityLog) => {
    const title = activity.details?.title || activity.details?.name
    switch (activity.action) {
      case "created_task":
      case "TASK_CREATED":
        return `Created task “${title || "task"}”`
      case "updated_task":
      case "TASK_UPDATED":
        return `Updated “${title || "task"}”`
      case "TASK_COMPLETED":
        return `Completed “${title || "task"}”`
      case "WORKFLOW_TRIGGERED":
        return `Ran workflow “${title || "automation"}”`
      default:
        return activity.action.replace(/_/g, " ").toLowerCase()
    }
  }

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
            title="Analytics"
            description="Activity, completion rates, and workflow performance."
            actions={
              <button
                type="button"
                onClick={() => fetchAnalytics()}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_#000] transition hover:bg-[#7df9ff]"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </button>
            }
          />

          {error && (
            <p className="mb-4 rounded-xl border-2 border-black bg-[#ff8ad8] px-4 py-2 text-sm font-semibold">
              {error}
            </p>
          )}

          <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Activity"
              value={data.totalActivities}
              color="#7df9ff"
              icon={ChartBarIcon}
            />
            <StatCard
              label="Completed"
              value={data.completedTasks}
              color="#9cff57"
              icon={CheckCircleIcon}
            />
            <StatCard
              label="Workflow runs"
              value={data.workflowTriggers}
              color="#ff8ad8"
              icon={BoltIcon}
            />
            <StatCard
              label="Contributors"
              value={data.activeUsers}
              color="#ffe66d"
              icon={UserGroupIcon}
            />
          </section>

          <div className="mb-6 grid gap-5 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-black bg-[#9cff57] px-8 py-6 shadow-[6px_6px_0px_#000] lg:min-w-[180px]">
              <p className="text-4xl font-black tabular-nums">{efficiencyScore}%</p>
              <p className="mt-1 text-[10px] font-black uppercase text-black/55">
                Completion rate
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Open tasks" value={data.totalTasks - data.completedTasks} color="#ffe66d" />
              <StatCard label="Overdue" value={data.overdueTasks} color="#ff8ad8" />
              <StatCard label="Live workflows" value={data.activeWorkflows} color="#7df9ff" />
            </div>
          </div>

          <section className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0px_#000]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-black/50">
                Recent activity
              </h2>
              <span className="rounded-full border-2 border-black bg-[#7df9ff] px-2.5 py-0.5 text-[9px] font-black uppercase">
                Live
              </span>
            </div>

            {data.recentActivities.length === 0 ? (
              <p className="py-8 text-center text-sm text-black/45">
                Activity appears when you create or update tasks and workflows.
              </p>
            ) : (
              <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {data.recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start gap-3 rounded-xl border-2 border-black/8 bg-[#f6f0e4]/40 px-3 py-2.5"
                  >
                    <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-black/35" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-black">
                        {formatActivity(activity)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-black/40">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </PageShell>
      </Sidebar>
    </RequireAuth>
  )
}
