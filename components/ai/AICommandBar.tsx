"use client"

import { useState, type FormEvent } from "react"

interface AICommandBarProps {
  onSubmit: (prompt: string) => void
  loading: boolean
}

const prompts = [
  "When design tasks are completed, notify marketing and move task to review.",
  "Create onboarding workflow for new developers.",
  "If a task becomes overdue, notify the team and escalate priority.",
]

export default function AICommandBar({ onSubmit, loading }: AICommandBarProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!prompt.trim()) return
    onSubmit(prompt.trim())
  }

  return (
    <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_#000] text-black">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border-[2px] border-black bg-[#ffe66d] px-4 py-1.5 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] text-black">
            AI Workflow Copilot
          </span>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight leading-none text-black">Describe your workflow in plain English</h2>
          <p className="mt-2 text-sm leading-6 text-black/75">
            OpsFlow will generate trigger rules, automation actions, and task plans automatically.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          placeholder="e.g. When design tasks are completed, notify marketing and move task to review."
          className="w-full rounded-[1.5rem] border-[3px] border-black bg-[#f6f0e4] px-5 py-4 text-sm font-semibold text-black placeholder:text-zinc-500 focus:bg-white focus:shadow-[4px_4px_0px_#000] focus:-translate-y-0.5 outline-none transition-all"
        />

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 text-xs text-black/60 font-black uppercase tracking-wider">
            <p>Example prompts:</p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              {prompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  className="w-fit text-left rounded-full border-[2px] border-black bg-white px-4.5 py-2 text-xs font-black uppercase tracking-wide text-black shadow-[2.5px_2.5px_0px_#000] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-fit inline-flex items-center justify-center rounded-[1.2rem] border-[3px] border-black bg-[#7df9ff] px-6 py-4 text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_#000] active:translate-y-[1.5px] active:shadow-none hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none self-end"
          >
            {loading ? "Thinking..." : "Generate workflow ➔"}
          </button>
        </div>
      </form>
    </div>
  )
}
