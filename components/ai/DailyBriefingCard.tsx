"use client"

interface DailyBriefingCardProps {
  totalTasks: number
  overdueCount: number
  activeWorkflows: number
  priorityItems: string[]
}

export default function DailyBriefingCard({ totalTasks, overdueCount, activeWorkflows, priorityItems }: DailyBriefingCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Daily briefing</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Today&apos;s priorities</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A quick operational briefing for what needs attention and what is moving.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">Active tasks</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalTasks}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">Overdue</p>
          <p className="mt-2 text-3xl font-semibold text-white">{overdueCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">Active workflows</p>
          <p className="mt-2 text-3xl font-semibold text-white">{activeWorkflows}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-300">
        {priorityItems.map((item) => (
          <div key={item} className="rounded-3xl bg-slate-900/80 p-4">
            <p className="text-sm text-slate-100">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
