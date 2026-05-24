"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

import { useRouter, useSearchParams } from "next/navigation"

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const msg = searchParams.get("message")

    if (msg) {
      setMessage(msg)
    }
  }, [searchParams])

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const res = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      )

      localStorage.setItem(
        "token",
        res.data.token
      )

      router.push("/dashboard")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Login failed"
        )
      } else {
        setError("Login failed")
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

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-[100px] h-[280px] w-[280px] rounded-full bg-[#7df9ff] opacity-20 blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[260px] w-[260px] rounded-full bg-[#ff8ad8] opacity-20 blur-[120px]" />
      </div>

      {/* BACK BUTTON */}
      <Link
        href="/"
        className="absolute left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Home
      </Link>

      {/* WRAPPER */}
      <div className="flex min-h-screen items-center justify-center px-5 py-24">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[3rem] border-[4px] border-black bg-white shadow-[12px_12px_0px_#000] lg:grid-cols-[1fr_0.92fr]">
          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden border-r-[4px] border-black bg-[#5f8dd3] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            {/* FLOATING */}
            <div className="absolute right-8 top-8 rotate-[8deg] rounded-full border-[3px] border-black bg-[#ffd166] px-4 py-2 text-[10px] font-black uppercase text-black shadow-[4px_4px_0px_#000]">
              AI ACTIVE
            </div>

            {/* TOP */}
            <div>
              <div className="inline-flex rounded-full border-[3px] border-black bg-[#ff8ad8] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[4px_4px_0px_#000]">
                OpsFlow OS
              </div>

              <h1 className="mt-10 text-[5rem] font-black uppercase leading-[0.88] tracking-[-0.08em]">
                ENTER
                <br />
                THE
                <br />
                FLOW
              </h1>

              <p className="mt-8 max-w-md text-lg leading-8 text-white/85">
                AI-powered workflow systems built for modern operational teams.
              </p>
            </div>

            {/* CARD */}
            <div className="rounded-[2.2rem] border-[4px] border-black bg-[#f6f0e4] p-7 text-black shadow-[8px_8px_0px_#000]">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.7rem] border-[4px] border-black bg-[#7df9ff] text-[3rem] shadow-[5px_5px_0px_#000]">
                  🤖
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-black/50">
                    OpsBot
                  </p>

                  <h2 className="mt-2 text-3xl font-black uppercase">
                    Workflow AI
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-black/70">
                    Monitoring operations and workflow execution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#111111] p-8 text-white sm:p-12">
            {/* MOBILE LOGO */}
            <div className="mb-10 flex items-center gap-4 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border-[3px] border-black bg-[#7df9ff] text-black shadow-[4px_4px_0px_#000]">
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

            {/* HEADING */}
            <div>
              <div className="inline-flex rounded-full border-[3px] border-black bg-[#7df9ff] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-[3px_3px_0px_#000]">
                Secure Login
              </div>

              <h2 className="mt-8 text-[3.5rem] font-black uppercase leading-[0.9] tracking-[-0.06em]">
                Sign In
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-400">
                Continue to your workflow workspace.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="mt-10 space-y-6"
            >
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
                  className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-base font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-1 focus:bg-white focus:shadow-[5px_5px_0px_#7df9ff]"
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
                  placeholder="Enter password"
                  className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-base font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-1 focus:bg-white focus:shadow-[5px_5px_0px_#ff8ad8]"
                />
              </div>

              {/* MESSAGE */}
              {message && (
                <div className="rounded-[1.4rem] border-[3px] border-black bg-[#b7f171] p-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">
                  {message}
                </div>
              )}

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
                className="flex w-full items-center justify-center rounded-[1.7rem] border-[4px] border-black bg-[#ffd166] px-6 py-5 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[7px_7px_0px_#000] transition-all hover:-translate-y-1 hover:bg-[#ffe27d]"
              >
                {loading
                  ? "Entering..."
                  : "Enter Workspace"}

                {!loading && (
                  <ArrowRightIcon className="ml-3 h-5 w-5" />
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-center text-sm text-zinc-400">
                No account?{" "}
                <Link
                  href="/signup"
                  className="font-black uppercase text-[#7df9ff] transition hover:text-white"
                >
                  Create One
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#efe7da]">
          <div className="rounded-[2rem] border-[4px] border-black bg-[#ff8ad8] px-8 py-6 text-xl font-black uppercase shadow-[8px_8px_0px_#000]">
            Loading...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}