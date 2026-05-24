"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bars3Icon,
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  HomeIcon,
  SparklesIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { getAuthToken } from "@/lib/authClient"

interface SidebarProps {
  children: React.ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Tasks", href: "/tasks", icon: ClipboardDocumentListIcon },
  { name: "Workflows", href: "/workflows", icon: BoltIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Team", href: "/team", icon: UserGroupIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
]

const sidebarSurface =
  "bg-[#fff9ee] bg-gradient-to-b from-[#fffdf5] via-[#fff9ee] to-[#f5faff]"

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [taskCount, setTaskCount] = useState<number | null>(null)
  const [workflowCount, setWorkflowCount] = useState<number | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setSidebarOpen(false), 0)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    const fetchCounts = async () => {
      try {
        const [taskRes, workflowRes] = await Promise.all([
          fetch("/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/workflows", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (taskRes.ok) {
          const data = await taskRes.json()
          setTaskCount(Array.isArray(data) ? data.length : null)
        }

        if (workflowRes.ok) {
          const data = await workflowRes.json()
          setWorkflowCount(
            Array.isArray(data)
              ? data.filter((item: { isActive?: boolean }) => item.isActive).length
              : null
          )
        }
      } catch (error) {
        console.error("Sidebar counts load error", error)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className="min-h-screen bg-[#ffe66d] text-black">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          <aside
            className={`absolute left-0 top-0 flex h-full w-[82%] max-w-[280px] flex-col overflow-y-auto border-r-[3px] border-black shadow-[8px_0_24px_rgba(0,0,0,0.08)] ${sidebarSurface}`}
          >
            <SidebarContent
              pathname={pathname}
              taskCount={taskCount}
              workflowCount={workflowCount}
            />

            <button
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-black bg-[#ff8ad8] shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-[276px] overflow-y-auto border-r-[3px] border-black shadow-[6px_0_20px_rgba(0,0,0,0.06)] lg:flex lg:flex-col ${sidebarSurface}`}
      >
        <SidebarContent
          pathname={pathname}
          taskCount={taskCount}
          workflowCount={workflowCount}
        />
      </aside>

      <header className="sticky top-0 z-30 border-b-[3px] border-black bg-[#ffe66d]/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border-[3px] border-black bg-[#7df9ff] shadow-[4px_4px_0px_#000]">
              <BoltIcon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-base font-black uppercase leading-none">OpsFlow</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-black/55">
                Workflow OS
              </p>
            </div>
          </div>

          <button
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="lg:pl-[276px]">
        <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-7">{children}</div>
      </main>
    </div>
  )
}

function SidebarContent({
  pathname,
  taskCount,
  workflowCount,
}: {
  pathname: string
  taskCount: number | null
  workflowCount: number | null
}) {
  return (
    <>
      <div className="border-b border-black/8 px-5 py-5">
        <Link href="/dashboard">
          <div className="rounded-[1.7rem] border-[3px] border-black bg-[#7df9ff] p-4 shadow-[5px_5px_0px_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border-[3px] border-black bg-[#ffe66d] shadow-[3px_3px_0px_#000]">
                <BoltIcon className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-[1.55rem] font-black uppercase leading-none tracking-[-0.06em]">
                  OpsFlow
                </h1>
                <p className="mt-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-black/60">
                  Intelligent Workflow OS
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-5 pt-5">
        <div className="rounded-[1.6rem] border-[3px] border-black bg-[#ff8ad8]/90 p-4 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[0.95rem] border-[3px] border-black bg-white text-2xl shadow-[3px_3px_0px_#000]">
              🤖
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase leading-none">OpsBot</h2>
                <div className="h-2.5 w-2.5 rounded-full bg-[#9cff57] ring-2 ring-black/10" />
              </div>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/65">
                AI orchestration active
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">
                AI Engine
              </span>
              <span className="text-[9px] font-black uppercase text-black/70">Online</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full border-2 border-black bg-white/90">
              <div className="h-full w-[88%] rounded-full bg-[#7df9ff]" />
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-6">
        <div className="mb-4 px-2">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-black/40">
            Workspace
          </p>
        </div>

        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            let badgeText = item.badge
            if (item.name === "Tasks" && taskCount !== null) {
              badgeText = String(taskCount)
            }
            if (item.name === "Workflows" && workflowCount !== null) {
              badgeText = String(workflowCount)
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center justify-between rounded-[1.2rem] border-[3px] px-3 py-2.5 transition-all duration-150 ${
                  isActive
                    ? "border-black bg-[#7df9ff] text-black shadow-[4px_4px_0px_#000]"
                    : "border-black/12 bg-white/70 text-black/75 hover:border-black hover:bg-[#ffe66d] hover:text-black hover:shadow-[4px_4px_0px_#000]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-[0.85rem] border-[3px] border-black transition-colors ${
                      isActive
                        ? "bg-[#ffe66d]"
                        : "bg-[#ff8ad8]/50 group-hover:bg-[#7df9ff]"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>

                  <span className="text-[12px] font-black uppercase tracking-[0.04em]">
                    {item.name}
                  </span>
                </div>

                {badgeText && (
                  <div className="rounded-full border-[2px] border-black bg-[#9cff57] px-2 py-0.5 text-[10px] font-black text-black shadow-[2px_2px_0px_#000]">
                    {badgeText}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-black/8 px-5 py-4">
        <div className="flex items-center justify-between rounded-[1.2rem] border-[3px] border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]">
          <div>
            <p className="text-[11px] font-black uppercase">OpsFlow OS</p>
            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-black/50">
              Version 0.1 Beta
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-[0.8rem] border-[3px] border-black bg-[#ffe66d] text-black">
            <SparklesIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </>
  )
}
