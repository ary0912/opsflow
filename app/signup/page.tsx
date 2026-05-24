"use client"

import Link from "next/link"
import axios from "axios"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      await axios.post(
        "/api/auth/register",
        {
          email,
          password,
        }
      )

      router.push(
        "/login?message=Account created successfully"
      )
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Signup failed"
        )
      } else {
        setError("Signup failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efe7da] text-black">
      {/* GRID */}
      <div
        className="fixed inset-0 -z-20 opacity-40"
        style={{
          backgroundImage: `
          linear-gradient(to right, #d9d1c6 1px, transparent 1px),
          linear-gradient(to bottom, #d9d1c6 1px, transparent 1px)
        `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* BLOBS */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-120px] top-[120px] h-[300px] w-[300px] rounded-full bg-[#ff8ad8] opacity-20 blur-[120px]" />

        <div className="absolute bottom-[-100px] left-[-100px] h-[260px] w-[260px] rounded-full bg-[#7df9ff] opacity-20 blur-[120px]" />
      </div>

      {/* BACK */}
      <Link
        href="/"
        className="absolute left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Home
      </Link>

      {/* WRAPPER */}
      <div className="flex min-h-screen items-center justify-center px-5 py-24">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[3rem] border-[4px] border-black bg-white shadow-[12px_12px_0px_#000] lg:grid-cols-[0.9fr_1fr]">
          {/* LEFT */}
          <div className="bg-[#111111] p-8 text-white sm:p-12">
            {/* MOBILE */}
            <div className="mb-10 flex items-center gap-4 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border-[3px] border-black bg-[#ff8ad8] text-black shadow-[4px_4px_0px_#000]">
                <BoltIcon className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black uppercase">
                  OpsFlow
                </h2>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  Workflow OS
                </p>
              </div>
            </div>

            {/* LABEL */}
            <div className="inline-flex rounded-full border-[3px] border-black bg-[#ff8ad8] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-[3px_3px_0px_#000]">
              Create Workspace
            </div>

            <h1 className="mt-8 text-[3.6rem] font-black uppercase leading-[0.9] tracking-[-0.08em]">
              START
              <br />
              BUILDING
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-zinc-400">
              Create your OpsFlow workspace and start building intelligent workflow systems.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSignup}
              className="mt-10 space-y-6"
            >
              {/* NAME */}
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Aryan Lodha"
                  className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-base font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-1 focus:bg-white focus:shadow-[5px_5px_0px_#7df9ff]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="hello@opsflow.ai"
                  className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-base font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-1 focus:bg-white focus:shadow-[5px_5px_0px_#ff8ad8]"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Create secure password"
                  className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-base font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-1 focus:bg-white focus:shadow-[5px_5px_0px_#ffd166]"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-[1.4rem] border-[3px] border-black bg-[#ff8ad8] p-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-[1.7rem] border-[4px] border-black bg-[#7df9ff] px-6 py-5 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[7px_7px_0px_#000] transition-all hover:-translate-y-1"
              >
                {loading
                  ? "Creating..."
                  : "Create Workspace"}

                {!loading && (
                  <ArrowRightIcon className="ml-3 h-5 w-5" />
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black uppercase text-[#ff8ad8] transition hover:text-white"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden overflow-hidden border-l-[4px] border-black bg-[#ffd166] p-10 lg:flex lg:flex-col lg:justify-between">
            {/* FLOAT */}
            <div className="absolute right-8 top-8 rotate-[-6deg] rounded-full border-[3px] border-black bg-[#7df9ff] px-4 py-2 text-[10px] font-black uppercase shadow-[4px_4px_0px_#000]">
              WORKFLOW AI
            </div>

            {/* TOP */}
            <div>
              <div className="inline-flex rounded-full border-[3px] border-black bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0px_#000]">
                Intelligent Automation
              </div>

              <h2 className="mt-10 text-[5rem] font-black uppercase leading-[0.88] tracking-[-0.08em]">
                BUILD
                <br />
                SMARTER
                <br />
                SYSTEMS
              </h2>

              <p className="mt-8 max-w-md text-lg leading-8 text-black/70">
                Coordinate workflows, tasks, teams, and automation in one intelligent workspace.
              </p>
            </div>

            {/* WINDOW CARD */}
            <div className="rounded-[2.4rem] border-[4px] border-black bg-[#5f8dd3] p-8 text-white shadow-[8px_8px_0px_#000]">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#ff8ad8]" />
                  <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#ffd166]" />
                  <div className="h-4 w-4 rounded-full border-[2px] border-black bg-[#b7f171]" />
                </div>

                <div className="rounded-full border-[2px] border-black bg-white px-3 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
                  OpsFlow
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.8rem] border-[4px] border-black bg-[#ff8ad8] text-[3rem] shadow-[5px_5px_0px_#000]">
                  ⚡
                </div>

                <div>
                  <h3 className="text-3xl font-black uppercase">
                    Workflow OS
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/80">
                    Intelligent operational infrastructure for modern digital teams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}