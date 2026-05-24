"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

const COMMANDS = [
  { id: "dashboard", title: "Go to Dashboard", href: "/dashboard" },
  { id: "tasks", title: "Open Tasks", href: "/tasks" },
  { id: "workflows", title: "Open Workflows", href: "/workflows" },
  { id: "analytics", title: "Open Analytics", href: "/analytics" },
  { id: "team", title: "Open Team", href: "/team" },
  { id: "settings", title: "Open Settings", href: "/settings" },
]

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const results = COMMANDS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))

  const onKey = useCallback((e: KeyboardEvent) => {
    const isMac = navigator.platform.toLowerCase().includes("mac")
    const k = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k"
    if (k) {
      e.preventDefault()
      setOpen((v) => !v)
    }

    if (e.key === "Escape") setOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onKey])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        inputRef.current?.focus()
        setIndex(0)
        setQuery("")
      }, 0)
      return () => clearTimeout(t)
    }
  }, [open])

  const run = (cmd: { href: string }) => {
    setOpen(false)
    router.push(cmd.href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-24">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-xl rounded-[2.5rem] border-[4px] border-black bg-[#efe7da] p-6 shadow-[10px_10px_0px_#000] overflow-hidden">
        {/* HEADER BADGE */}
        <div className="mb-4 flex justify-between items-center">
          <div className="inline-flex rounded-full border-[2.5px] border-black bg-[#ff8ad8] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] shadow-[2px_2px_0px_#000]">
            OpsFlow OS Command
          </div>
          <div className="text-[10px] font-black uppercase text-black/50 tracking-wider">
            Press ESC to exit
          </div>
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault(); setIndex((i) => Math.min(i + 1, (results.length === 0 ? COMMANDS : results).length - 1))
            }
            if (e.key === "ArrowUp") {
              e.preventDefault(); setIndex((i) => Math.max(i - 1, 0))
            }
            if (e.key === "Enter") {
              e.preventDefault(); run((results.length === 0 ? COMMANDS : results)[index] || COMMANDS[0])
            }
          }}
          placeholder="Type a command or page name..."
          className="w-full rounded-[1.2rem] border-[3px] border-black bg-white px-5 py-4 text-base font-semibold text-black outline-none shadow-[4px_4px_0px_#000] focus:shadow-[5px_5px_0px_#7df9ff] focus:-translate-y-0.5 transition-all placeholder:text-zinc-400"
          aria-label="Command palette"
        />

        <ul className="mt-6 max-h-64 overflow-auto space-y-2 pr-1">
          {(results.length === 0 ? COMMANDS : results).map((c, i) => (
            <li
              key={c.id}
              onClick={() => run(c)}
              className={`cursor-pointer rounded-[1.2rem] border-[3px] px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-100 ${
                i === index
                  ? "border-black bg-[#ffe66d] text-black shadow-[4px_4px_0px_#000] -translate-y-0.5"
                  : "border-black/15 bg-white text-black hover:border-black hover:bg-[#ffe66d] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{c.title}</span>
                <span className="text-[9px] text-black/50 font-bold">navigate ➔</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
