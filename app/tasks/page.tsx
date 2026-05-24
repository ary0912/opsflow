"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FunnelIcon } from "@heroicons/react/24/outline"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"
import RequireAuth from "@/components/auth/RequireAuth"
import KanbanBoard, { type TaskFilters } from "@/components/task/KanbanBoard"
import { clearAuthToken, getAuthToken } from "@/lib/authClient"

export default function TasksPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [filters, setFilters] = useState<TaskFilters>({ status: "", priority: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const stored = getAuthToken()
    if (!stored) {
      clearAuthToken()
      router.replace("/login")
      return
    }
    setToken(stored)
  }, [router])

  const runAiPrioritize = useCallback(async () => {
    if (!token) return
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "prioritize" }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message || "Updated")
        setRefreshKey((k) => k + 1)
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }, [token])

  const scrollToForm = () => {
    document.getElementById("quick-task-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const chipBtn =
    "rounded-xl border-[3px] border-black px-3 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5"

  return (
    <RequireAuth>
      <Sidebar>
        <PageShell className="p-4 sm:p-6">
          <PageHeader
            title="Tasks"
            description="Add work, drag cards between columns, and manage priorities."
            actions={
              <>
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className={`${chipBtn} bg-white`}
                >
                  <FunnelIcon className="mr-1 inline h-4 w-4" />
                  Filter
                </button>
                <button
                  type="button"
                  onClick={runAiPrioritize}
                  disabled={aiLoading || !token}
                  className={`${chipBtn} bg-[#ffe66d] disabled:opacity-50`}
                >
                  {aiLoading ? "…" : "AI prioritize"}
                </button>
                <Link href="/workflows?create=ai" className={`${chipBtn} bg-[#7df9ff]`}>
                  Automate
                </Link>
              </>
            }
          />

          {message && (
            <p className="mb-4 rounded-xl border-2 border-black bg-[#9cff57] px-4 py-2 text-sm font-semibold">
              {message}
            </p>
          )}

          {showFilters && (
            <div className="mb-4 flex flex-wrap gap-3 rounded-xl border-2 border-black/10 bg-white/80 p-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
                aria-label="Status"
              >
                <option value="">Any status</option>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
                aria-label="Priority"
              >
                <option value="">Any priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}

          <section className="rounded-2xl border-[3px] border-black bg-white/95 p-4 shadow-[6px_6px_0px_#000] sm:p-6">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={scrollToForm}
                className={`${chipBtn} bg-[#9cff57]`}
              >
                + New task
              </button>
            </div>

            {token ? (
              <KanbanBoard token={token} filters={filters} refreshKey={refreshKey} />
            ) : (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />
              </div>
            )}
          </section>
        </PageShell>
      </Sidebar>
    </RequireAuth>
  )
}
