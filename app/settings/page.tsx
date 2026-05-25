"use client"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"

import {
  BellIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"

export default function SettingsPage() {
  return (
    <>
      <Sidebar>
        <PageShell className="p-4 sm:p-6">
          <PageHeader
            title="Settings"
            description="Account preferences and workspace defaults."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <div className="flex items-start gap-4">
                <div className="rounded-xl border-[3px] border-black bg-[#7df9ff] p-3">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase">Account</h2>
                  <p className="mt-1 text-sm text-black/55">
                    Profile, security, and notifications.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  {
                    icon: ShieldCheckIcon,
                    title: "Authentication",
                    text: "Password and session security.",
                  },
                  {
                    icon: BellIcon,
                    title: "Notifications",
                    text: "Workflow and task alerts.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-xl border-2 border-black/10 bg-[#f6f0e4]/40 p-3"
                  >
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-black/50" />
                    <div>
                      <p className="text-sm font-black uppercase">{item.title}</p>
                      <p className="mt-0.5 text-xs text-black/50">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-xl border-2 border-dashed border-black/15 px-4 py-3 text-xs text-black/45">
                Advanced account controls are coming in a future update.
              </p>
            </section>

            <section className="rounded-2xl border-[3px] border-black bg-[#ff8ad8] p-6 shadow-[6px_6px_0px_#000]">
              <div className="flex items-start gap-4">
                <div className="rounded-xl border-[3px] border-black bg-[#ffe66d] p-3">
                  <Cog6ToothIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase">Workspace</h2>
                  <p className="mt-1 text-sm text-black/70">
                    Automation defaults and appearance.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "AI workflow defaults",
                  "Team productivity rules",
                  "Workspace appearance",
                ].map((title) => (
                  <li
                    key={title}
                    className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000]"
                  >
                    <SparklesIcon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-black uppercase">{title}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-xl border-2 border-black bg-[#7df9ff] px-4 py-3 text-xs font-semibold text-black/70">
                Workspace settings will be configurable here soon.
              </p>
            </section>
          </div>

          <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-wider text-black/35">
            OpsFlow · System online
          </p>
        </PageShell>
      </Sidebar>
    </>
  )
}
