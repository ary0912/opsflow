"use client"

import { ParsedAiWorkflow } from "@/services/openAiService"

interface WorkflowPreviewProps {
  preview: ParsedAiWorkflow
  onExecute: () => void
  executing: boolean
}

export default function WorkflowPreview({ preview, onExecute, executing }: WorkflowPreviewProps) {
  return (
    <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_#000] text-black">
      <div className="flex flex-col gap-5">
        <div>
          <span className="inline-flex rounded-full border-[2.5px] border-black bg-[#ff8ad8] px-4 py-1.5 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] text-black">
            Workflow Preview
          </span>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight leading-none text-black">{preview.name}</h2>
          <p className="mt-2 text-sm leading-6 text-black/75">{preview.description || "No description provided."}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-black bg-[#f6f0e4] p-4 shadow-[3px_3px_0px_#000]">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/55">Trigger</p>
            <p className="mt-2 text-sm font-black uppercase text-black break-all">{preview.trigger.replace(/_/g, " ")}</p>
          </div>
          <div className="rounded-2xl border-[3px] border-black bg-[#f6f0e4] p-4 shadow-[3px_3px_0px_#000]">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/55">Conditions</p>
            <p className="mt-2 text-sm font-black uppercase text-black">{preview.conditions?.length ? preview.conditions.length : "None"}</p>
          </div>
          <div className="rounded-2xl border-[3px] border-black bg-[#f6f0e4] p-4 shadow-[3px_3px_0px_#000]">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/55">Actions Count</p>
            <p className="mt-2 text-sm font-black uppercase text-black">{preview.actions.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border-[3px] border-black bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-black/55 mb-3">Automation Actions</p>
          <ul className="space-y-3 text-sm text-black">
            {preview.actions.map((action, index) => (
              <li key={index} className="rounded-[1rem] border-[2px] border-black bg-[#f6f0e4] p-3">
                <p className="font-black uppercase text-xs text-black">{action.type.replace(/_/g, " ")}</p>
                <pre className="mt-1.5 text-[11px] font-mono text-black/70 overflow-auto whitespace-pre-wrap bg-white/50 p-2 rounded-lg border border-black/5">
                  {JSON.stringify(action.params, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>

        {preview.tasks?.length ? (
          <div className="rounded-2xl border-[3px] border-black bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/55 mb-3">Generated Workspace Tasks</p>
            <ul className="space-y-3 text-sm text-black">
              {preview.tasks.map((task, index) => (
                <li key={index} className="rounded-[1rem] border-[2px] border-black bg-[#f6f0e4] p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-black uppercase text-xs text-black">{task.title}</p>
                    <span className="rounded-full border border-black bg-[#ffe66d] px-2 py-0.5 text-[8px] font-black uppercase">
                      {task.priority || "medium"}
                    </span>
                  </div>
                  {task.projectName && (
                    <p className="mt-1 text-[10px] font-bold text-black/50">
                      Project: {task.projectName}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <button
          onClick={onExecute}
          disabled={executing}
          className="mt-4 inline-flex w-full items-center justify-center rounded-[1.2rem] border-[3px] border-black bg-[#9cff57] px-6 py-4 text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_#000] active:translate-y-[1.5px] active:shadow-none hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {executing ? "Creating workflow..." : "Create workflow ➔"}
        </button>
      </div>
    </div>
  )
}
