"use client"

import Link from "next/link"

import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"

function WindowCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-[2.5rem] border-[4px] border-black bg-[#f6f0e4] shadow-[10px_10px_0px_#000] transition-all duration-300 hover:-translate-y-1 hover:shadow-[14px_14px_0px_#000] ${className}`}
    >
      {/* WINDOW HEADER */}
      <div className="flex items-center justify-between border-b-[4px] border-black bg-[#ece3d5] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#ff7a59]" />
          <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#ffd166]" />
          <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#b7f171]" />
        </div>

        <div className="rounded-full border-[2px] border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[2px_2px_0px_#000]">
          OpsFlow OS
        </div>
      </div>

      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#efe7da] text-black">
      {/* BACKGROUND GRID */}
      <div
        className="fixed inset-0 -z-20 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d8d0c4 1px, transparent 1px),
            linear-gradient(to bottom, #d8d0c4 1px, transparent 1px)
          `,
          backgroundSize: "58px 58px",
        }}
      />

      {/* BACKGROUND BLOBS */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-100px] top-[140px] h-[280px] w-[280px] rounded-full bg-pink-300 opacity-30 blur-[120px]" />

        <div className="absolute right-[-100px] top-[420px] h-[260px] w-[260px] rounded-full bg-cyan-300 opacity-30 blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b-[4px] border-black bg-[#efe7da]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border-[3px] border-black bg-[#7df9ff] shadow-[4px_4px_0px_#000]">
              <BoltIcon className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-black uppercase tracking-[-0.06em]">
                OpsFlow
              </h1>

              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-black/60">
                Intelligent Workflow OS
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login?callbackUrl=/dashboard"
              className="rounded-full border-[3px] border-black bg-[#ff8ad8] px-6 py-3 text-sm font-black uppercase shadow-[5px_5px_0px_#000] transition-all hover:-translate-y-1"
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-16">
        <div className="mx-auto max-w-7xl">
          {/* LABEL */}
          <div className="flex justify-center">
            <div className="inline-flex rotate-[-2deg] rounded-full border-[3px] border-black bg-[#ffd166] px-6 py-3 text-xs font-black uppercase shadow-[4px_4px_0px_#000]">
              AI Powered Workflow Infrastructure
            </div>
          </div>

          {/* HEADING */}
          <div className="relative mt-10">
            <h1 className="mx-auto max-w-6xl text-center text-[3.5rem] font-black uppercase leading-[0.9] tracking-[-0.08em] md:text-[7rem]">
              BUILD
              <br />
              INTELLIGENT
              <br />
              WORKFLOW
              <br />
              SYSTEMS
            </h1>

            {/* FLOATING TAGS */}
            <div className="absolute left-[6%] top-[20%] hidden rotate-[-6deg] rounded-[1.5rem] border-[3px] border-black bg-[#7df9ff] px-5 py-3 text-xs font-black uppercase shadow-[6px_6px_0px_#000] xl:block">
              Live Automation
            </div>

            <div className="absolute right-[6%] top-[56%] hidden rotate-[6deg] rounded-[1.5rem] border-[3px] border-black bg-[#b7f171] px-5 py-3 text-xs font-black uppercase shadow-[6px_6px_0px_#000] xl:block">
              AI Workflows
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-9 text-black/70 md:text-xl">
            OpsFlow helps teams automate operations, manage workflows,
            coordinate execution, and build AI-powered productivity systems
            from one unified platform.
          </p>

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <Link
              href="/login?callbackUrl=/dashboard"
              className="inline-flex items-center rounded-[1.5rem] border-[3px] border-black bg-[#ff8ad8] px-8 py-5 text-sm font-black uppercase shadow-[6px_6px_0px_#000] transition-all hover:-translate-y-1"
            >
              Get Started For Free
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Link>
          </div>

          {/* MAIN WINDOW */}
          <div className="relative mt-24">
            <WindowCard>
              <div className="bg-[#5f8dd3] p-6 text-white md:p-10">
                {/* TOP */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex rounded-full border-[3px] border-black bg-[#ff8ad8] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[3px_3px_0px_#000]">
                      OpsBot Active
                    </div>

                    <h2 className="mt-6 text-5xl font-black uppercase leading-none tracking-[-0.06em] md:text-7xl">
                      WORKFLOW
                      <br />
                      COMMAND
                      <br />
                      CENTER
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
                      Manage workflows, automate repetitive execution,
                      coordinate tasks, and monitor operational activity from
                      one intelligent workspace.
                    </p>
                  </div>

                  {/* BOT PANEL */}
                  <div className="rounded-[2rem] border-[4px] border-black bg-[#f6f0e4] p-8 text-black shadow-[8px_8px_0px_#000]">
                    <div className="text-center">
                      <div className="text-[5rem]">🤖</div>

                      <h3 className="mt-4 text-2xl font-black uppercase">
                        OpsBot AI
                      </h3>

                      <div className="mt-6 h-5 overflow-hidden rounded-full border-[3px] border-black bg-white">
                        <div className="h-full w-[82%] bg-[#7df9ff]" />
                      </div>

                      <p className="mt-4 text-sm font-black uppercase">
                        AI Systems Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* TASK GRID */}
                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                  {[
                    {
                      title: "Planning",
                      color: "#ffd166",
                    },
                    {
                      title: "Execution",
                      color: "#ff8ad8",
                    },
                    {
                      title: "Automation",
                      color: "#b7f171",
                    },
                  ].map((column) => (
                    <div
                      key={column.title}
                      className="rounded-[2rem] border-[4px] border-black bg-[#f6f0e4] p-5 text-black shadow-[5px_5px_0px_#000]"
                    >
                      <div
                        className="inline-flex rounded-full border-[3px] border-black px-4 py-2 text-xs font-black uppercase"
                        style={{
                          backgroundColor: column.color,
                        }}
                      >
                        {column.title}
                      </div>

                      <div className="mt-5 space-y-4">
                        {[1, 2, 3].map((task) => (
                          <div
                            key={task}
                            className="rounded-[1.5rem] border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_#000]"
                          >
                            <p className="text-sm font-black uppercase">
                              AI Workflow Sync
                            </p>

                            <p className="mt-2 text-sm leading-6 text-black/60">
                              Intelligent operational execution and automated
                              workflow orchestration.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </WindowCard>

            {/* ANALYTICS CARDS */}
            <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Workflow Engine",
                  value: "ACTIVE",
                  color: "#7df9ff",
                  icon: ChartBarIcon,
                },
                {
                  title: "AI Automation",
                  value: "ONLINE",
                  color: "#ffd166",
                  icon: CpuChipIcon,
                },
                {
                  title: "Team Workspace",
                  value: "SYNCED",
                  color: "#ff8ad8",
                  icon: UserGroupIcon,
                },
              ].map((item) => (
                <WindowCard
                  key={item.title}
                  className="h-full"
                >
                  <div
                    className="flex min-h-[320px] flex-col justify-between p-8 md:min-h-[360px]"
                    style={{
                      backgroundColor: item.color,
                    }}
                  >
                    <div>
                      <item.icon className="h-12 w-12" />

                      <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
                        {item.title}
                      </p>
                    </div>

                    <div className="mt-10">
                      <h3 className="break-words text-5xl font-black uppercase leading-none tracking-[-0.06em] md:text-6xl">
                        {item.value}
                      </h3>
                    </div>
                  </div>
                </WindowCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex rotate-[2deg] rounded-full border-[3px] border-black bg-[#b7f171] px-6 py-3 text-xs font-black uppercase shadow-[4px_4px_0px_#000]">
              Platform Features
            </div>

            <h2 className="mt-8 text-[3rem] font-black uppercase leading-[0.92] tracking-[-0.08em] md:text-[5rem]">
              DESIGNED FOR
              <br />
              MODERN OPERATIONS
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: "Smart Task Management",
                icon: ClipboardDocumentListIcon,
                color: "#7df9ff",
              },
              {
                title: "Workflow Automation",
                icon: SparklesIcon,
                color: "#ff8ad8",
              },
              {
                title: "Team Collaboration",
                icon: UserGroupIcon,
                color: "#b7f171",
              },
              {
                title: "Operational Analytics",
                icon: ChartBarIcon,
                color: "#ffd166",
              },
            ].map((feature, index) => (
              <WindowCard
                key={feature.title}
                className={
                  index % 2 === 0
                    ? "rotate-[-1deg]"
                    : "rotate-[1deg]"
                }
              >
                <div
                  className="p-8"
                  style={{
                    backgroundColor: feature.color,
                  }}
                >
                  <feature.icon className="h-14 w-14" />

                  <h3 className="mt-6 text-4xl font-black uppercase">
                    {feature.title}
                  </h3>

                  <p className="mt-5 max-w-lg text-lg leading-8 text-black/70">
                    Build scalable operational systems with intelligent
                    workflow execution and AI-enhanced productivity tools.
                  </p>
                </div>
              </WindowCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <WindowCard>
            <div className="bg-[#ff8ad8] p-10 md:p-16">
              <div className="mx-auto max-w-3xl">
                <div className="inline-flex rounded-full border-[3px] border-black bg-[#ffd166] px-5 py-3 text-xs font-black uppercase shadow-[4px_4px_0px_#000]">
                  Product In Active Development
                </div>

                <h2 className="mt-8 text-[3rem] font-black uppercase leading-[0.92] tracking-[-0.08em] md:text-[5rem]">
                  BUILD YOUR AI
                  <br />
                  OPERATING SYSTEM
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-black/70">
                  OpsFlow is currently being crafted to help teams automate
                  workflows, streamline operations, and execute smarter.
                </p>

                <div className="mt-12 flex justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center rounded-[1.5rem] border-[3px] border-black bg-[#7df9ff] px-8 py-5 text-sm font-black uppercase shadow-[6px_6px_0px_#000]"
                  >
                    Explore Platform
                    <ArrowRightIcon className="ml-3 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </WindowCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[4px] border-black bg-[#111111] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          {/* BRAND */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border-[3px] border-black bg-[#7df9ff] text-black shadow-[4px_4px_0px_#fff]">
              <BoltIcon className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-black uppercase">
                OpsFlow
              </h3>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                Workflow Operating System
              </p>
            </div>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.16em] text-white/60">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </div>

          {/* COPYRIGHT */}
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
            © 2026 OpsFlow
          </p>
        </div>
      </footer>
    </main>
  )
}