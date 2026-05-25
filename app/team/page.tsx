"use client"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"

import {
  BoltIcon,
  UserGroupIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"

export default function TeamPage() {
  return (
    <>
      <Sidebar>
        <PageShell className="p-4 sm:p-6">
          <PageHeader
            title="Team"
            description="Invite collaborators and share workflows. Member management is coming soon."
            badge="Beta"
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <div className="flex items-start gap-4">
                <div className="rounded-xl border-[3px] border-black bg-[#ffe66d] p-3">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase">Members</h2>
                  <p className="mt-1 text-sm text-black/55">
                    Teammates you invite will show up here.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border-2 border-dashed border-black/15 bg-[#f6f0e4]/50 py-10 text-center">
                <p className="text-4xl" aria-hidden>
                  🚀
                </p>
                <p className="mt-3 text-sm font-semibold text-black/50">No members yet</p>
                <button
                  type="button"
                  className="mt-5 rounded-xl border-[3px] border-black bg-[#7df9ff] px-5 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5"
                >
                  Invite team
                </button>
              </div>
            </section>

            <section className="rounded-2xl border-[3px] border-black bg-[#ff8ad8] p-6 shadow-[6px_6px_0px_#000]">
              <h2 className="text-lg font-black uppercase">Why teams</h2>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    icon: UserGroupIcon,
                    title: "Shared ownership",
                    text: "Clear accountability on tasks and projects.",
                  },
                  {
                    icon: SparklesIcon,
                    title: "Shared automations",
                    text: "Reuse workflows across the workspace.",
                  },
                  {
                    icon: ChatBubbleLeftRightIcon,
                    title: "Coordination",
                    text: "Keep execution aligned in one place.",
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: "Visibility",
                    text: "See progress and blockers together.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-xl border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000]"
                  >
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-black uppercase">{item.title}</p>
                      <p className="mt-0.5 text-xs text-black/55">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </PageShell>
      </Sidebar>
    </>
  )
}
