"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import Sidebar from "@/components/layout/Sidebar"
import PageHeader, { SectionHeading } from "@/components/layout/PageHeader"
import PageShell from "@/components/layout/PageShell"
import RequireAuth from "@/components/auth/RequireAuth"
import StatCard from "@/components/ui/StatCard"
import AICommandBar from "@/components/ai/AICommandBar"
import WorkflowPreview from "@/components/ai/WorkflowPreview"

import { clearAuthToken } from "@/lib/authClient"

import {
  PlusIcon,
  BoltIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  SparklesIcon,
  CpuChipIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline"

interface WorkflowAction {
  type: string
  params: {
    status?: string
    priority?: string
    title?: string
  }
}

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  actions: WorkflowAction[]
  isActive: boolean
  createdAt: string
}

const triggers = [
  {
    value: "task_created",
    label: "Task Created",
  },
  {
    value: "task_updated",
    label: "Task Updated",
  },
  {
    value: "task_completed",
    label: "Task Completed",
  },
]

const actionTypes = [
  {
    value: "update_task_status",
    label: "Update Task Status",
  },
  {
    value: "update_task_priority",
    label: "Update Task Priority",
  },
  {
    value: "create_task",
    label: "Create Follow-up Task",
  },
]

const workflowTemplates = [
  {
    title: "Bug Triage System",
    description:
      "Automatically prioritize and assign incoming bugs.",
    prompt:
      "When a task is created, escalate priority to high and move it to in progress for bug triage.",
  },
  {
    title: "Sprint Automation",
    description:
      "Move completed tasks into QA review pipelines.",
    prompt:
      "When a task is completed, create a follow-up QA review task with medium priority.",
  },
  {
    title: "Client Onboarding",
    description:
      "Generate onboarding tasks and approvals automatically.",
    prompt:
      "Create an onboarding workflow with checklist tasks for new developers when tasks complete.",
  },
]

function normalizeWorkflowActions(actions: unknown): WorkflowAction[] {
  if (Array.isArray(actions)) return actions as WorkflowAction[]
  if (typeof actions === "string") {
    try {
      const parsed = JSON.parse(actions)
      return Array.isArray(parsed) ? (parsed as WorkflowAction[]) : []
    } catch {
      return []
    }
  }
  return []
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<
    Workflow[]
  >([])

  const [loading, setLoading] =
    useState(true)

  const [showCreatePanel, setShowCreatePanel] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] = useState("")

  const [workflowName, setWorkflowName] =
    useState("")

  const [
    workflowDescription,
    setWorkflowDescription,
  ] = useState("")

  const [
    workflowTrigger,
    setWorkflowTrigger,
  ] = useState(triggers[0].value)

  const [
    workflowActionType,
    setWorkflowActionType,
  ] = useState(actionTypes[0].value)

  const [
    workflowActionStatus,
    setWorkflowActionStatus,
  ] = useState("in_progress")

  const [
    workflowActionPriority,
    setWorkflowActionPriority,
  ] = useState("high")

  const [
    workflowActionTitle,
    setWorkflowActionTitle,
  ] = useState("")

  const [creationMode, setCreationMode] = useState<"ai" | "manual">("ai")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPreview, setAiPreview] = useState<any>(null)
  const [aiExecuting, setAiExecuting] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null)
  const [creatingManual, setCreatingManual] = useState(false)

  const router = useRouter()

  const openCreatePanel = (mode: "ai" | "manual" = "ai") => {
    setShowCreatePanel(true)
    setCreationMode(mode)
    setError("")
  }

  const handleAiSubmit = async (promptText: string) => {
    setAiLoading(true)
    setError("")
    setAiPreview(null)
    setAiPrompt(promptText)

    const token = localStorage.getItem("token")
    if (!token) {
      clearAuthToken()
      router.replace("/login")
      return
    }

    try {
      const res = await fetch("/api/ai/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: promptText, mode: "preview" }),
      })

      const data = await res.json()
      if (res.ok && data.preview) {
        setAiPreview(data.preview)
        setMessage("Preview ready — review and create below.")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setError(data.error || "Failed to generate AI preview")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to generate AI preview")
    } finally {
      setAiLoading(false)
    }
  }

  const handleAiExecute = async () => {
    if (!aiPrompt) return
    setAiExecuting(true)
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      clearAuthToken()
      router.replace("/login")
      return
    }

    try {
      const res = await fetch("/api/ai/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: aiPrompt, mode: "execute" }),
      })

      const data = await res.json()
      if (res.ok) {
        if (data.workflow) {
          setWorkflows((prev) => [data.workflow, ...prev])
        }
        await fetchWorkflows()
        setMessage("Workflow created successfully!")
        setAiPreview(null)
        setAiPrompt("")
        setShowCreatePanel(false)
        setTimeout(() => setMessage(""), 3000)
      } else {
        setError(data.error || "Failed to create workflow")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to create workflow")
    } finally {
      setAiExecuting(false)
    }
  }

  const fetchWorkflows = useCallback(
    async () => {
      setLoading(true)
      setError("")

      try {
        const token =
          localStorage.getItem("token")

        if (!token) {
          clearAuthToken()

          router.replace("/login")

          return
        }

        const response = await fetch(
          "/api/workflows",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (response.status === 401) {
          clearAuthToken()

          router.replace("/login")

          return
        }

        if (response.ok) {
          setWorkflows(data)
        } else {
          setError(
            data.error ||
            "Unable to load workflows"
          )
        }
      } catch (err) {
        console.error(err)

        setError(
          "Unable to load workflows"
        )
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const create = params.get("create")
    if (create === "ai" || create === "manual") {
      openCreatePanel(create === "manual" ? "manual" : "ai")
    }
    const prompt = params.get("prompt")
    if (prompt && create === "ai") {
      void handleAiSubmit(decodeURIComponent(prompt))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useTemplate = (prompt: string) => {
    openCreatePanel("ai")
    void handleAiSubmit(prompt)
  }

  const runWorkflowNow = async (workflowId: string) => {
    setRunningWorkflowId(workflowId)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        clearAuthToken()
        router.replace("/login")
        return
      }
      const response = await fetch(`/api/workflows/${workflowId}/run`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        setMessage(
          `Ran on ${data.tasksAffected} of ${data.tasksScanned} task${data.tasksScanned === 1 ? "" : "s"}.`
        )
        setTimeout(() => setMessage(""), 4000)
      } else {
        setError(data.error || "Failed to run workflow")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to run workflow")
    } finally {
      setRunningWorkflowId(null)
    }
  }

  const activeWorkflowCount = useMemo(
    () =>
      workflows.filter(
        (workflow) => workflow.isActive
      ).length,
    [workflows]
  )

  const clearCreateForm = () => {
    setWorkflowName("")
    setWorkflowDescription("")
    setWorkflowTrigger(
      triggers[0].value
    )
    setWorkflowActionType(
      actionTypes[0].value
    )
    setWorkflowActionStatus(
      "in_progress"
    )
    setWorkflowActionPriority("high")
    setWorkflowActionTitle("")
  }

  const createWorkflow = async () => {
    if (!workflowName.trim()) {
      setError("Workflow name is required")
      return
    }

    setError("")
    setCreatingManual(true)

    try {
      const token =
        localStorage.getItem("token")

      if (!token) {
        clearAuthToken()

        router.replace("/login")

        return
      }

      const action: WorkflowAction = {
        type: workflowActionType,

        params: {
          status:
            workflowActionType ===
              "update_task_status"
              ? workflowActionStatus
              : undefined,

          priority:
            workflowActionType ===
              "update_task_priority"
              ? workflowActionPriority
              : undefined,

          title:
            workflowActionType ===
              "create_task"
              ? workflowActionTitle ||
              "Auto-generated follow-up task"
              : undefined,
        },
      }

      const response = await fetch(
        "/api/workflows",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: workflowName.trim(),
            description:
              workflowDescription.trim(),
            trigger: workflowTrigger,
            actions: [action],
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setWorkflows((prev) => [
          data,
          ...prev,
        ])

        setMessage(
          "Workflow created successfully."
        )

        clearCreateForm()

        setShowCreatePanel(false)

        setTimeout(
          () => setMessage(""),
          3000
        )
      } else {
        setError(
          data.error ||
          "Failed to create workflow"
        )
      }
    } catch (err) {
      console.error(err)

      setError("Failed to create workflow")
    } finally {
      setCreatingManual(false)
    }
  }

  const toggleWorkflow = async (
    workflowId: string,
    isActive: boolean
  ) => {
    try {
      const token =
        localStorage.getItem("token")

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            isActive: !isActive,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setWorkflows((prev) =>
          prev.map((workflow) =>
            workflow.id === data.id
              ? data
              : workflow
          )
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteWorkflow = async (
    workflowId: string
  ) => {
    const confirmed = window.confirm(
      "Delete this workflow?"
    )

    if (!confirmed) {
      return
    }

    try {
      const token =
        localStorage.getItem("token")

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        setWorkflows((prev) =>
          prev.filter(
            (workflow) =>
              workflow.id !== workflowId
          )
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const chipBtn =
    "inline-flex items-center gap-2 rounded-xl border-[3px] border-black px-4 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5"

  return (
    <RequireAuth>
      <Sidebar>
        <PageShell className="p-4 sm:p-6">
          <PageHeader
            title="Workflows"
            description="Build automations with AI or manual triggers — run them on your tasks anytime."
            badge="Automation"
            actions={
              <>
                <button
                  type="button"
                  onClick={() => openCreatePanel("ai")}
                  className={`${chipBtn} bg-[#ffe66d]`}
                >
                  <SparklesIcon className="h-4 w-4" />
                  New automation
                </button>
                <button
                  type="button"
                  onClick={() => openCreatePanel("manual")}
                  className={`${chipBtn} bg-white`}
                >
                  <PlusIcon className="h-4 w-4" />
                  Manual
                </button>
              </>
            }
          />

          <section className="mb-8 grid grid-cols-3 gap-3">
            <StatCard label="Active" value={activeWorkflowCount} color="#7df9ff" />
            <StatCard label="Total" value={workflows.length} color="#ff8ad8" />
            <StatCard label="Status" value="Live" color="#9cff57" />
          </section>

          <section className="mb-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border-2 border-black bg-[#ff8ad8] px-3 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]">
                Templates
              </span>
              <SectionHeading className="!text-xl sm:!text-2xl">
                Starters
              </SectionHeading>
            </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {workflowTemplates.map(
                  (template) => (
                    <div
                      key={template.title}
                      className="rounded-[2rem] border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_#000]"
                    >
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-black bg-[#7df9ff]">
                        <RocketLaunchIcon className="h-7 w-7" />
                      </div>

                      <h3 className="text-2xl font-black uppercase">
                        {template.title}
                      </h3>

                      <p className="mt-4 text-base leading-7 text-black/70">
                        {template.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => useTemplate(template.prompt)}
                        disabled={aiLoading}
                        className="mt-6 rounded-2xl border-[3px] border-black bg-[#ffe66d] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {aiLoading ? "Generating…" : "Use Template"}
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ALERTS */}
            {message && (
              <div className="mb-6 rounded-2xl border-[4px] border-black bg-[#9cff57] p-5 font-black uppercase shadow-[6px_6px_0px_#000]">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border-[4px] border-black bg-[#ff8ad8] p-5 font-black uppercase shadow-[6px_6px_0px_#000]">
                {error}
              </div>
            )}

            {/* CREATE PANEL */}
            {showCreatePanel && (
              <section className="mb-8 rounded-[3rem] border-[4px] border-black bg-white p-8 shadow-[10px_10px_0px_#000]">
                <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border-[3px] border-black bg-[#ffe66d] px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_#000]">
                      Workflow Builder
                    </div>

                    <SectionHeading className="!text-xl sm:!text-2xl">
                      Builder
                    </SectionHeading>

                    <p className="mt-3 max-w-2xl text-base leading-7 text-black/70">
                      Use AI to describe your workflow in plain English, or
                      configure it manually with triggers and actions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCreatePanel(false)
                      setAiPreview(null)
                      setAiPrompt("")
                      setError("")
                    }}
                    className="rounded-2xl border-[3px] border-black bg-[#ff8ad8] px-5 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5"
                  >
                    Close
                  </button>
                </div>

                {/* MODE TOGGLE */}
                <div className="mb-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreationMode("ai")}
                    className={`inline-flex items-center gap-2 rounded-2xl border-[3px] border-black px-6 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000] ${creationMode === "ai"
                        ? "bg-[#7df9ff]"
                        : "bg-white"
                      }`}
                  >
                    <SparklesIcon className="h-5 w-5" />
                    AI Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreationMode("manual")}
                    className={`inline-flex items-center gap-2 rounded-2xl border-[3px] border-black px-6 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000] ${creationMode === "manual"
                        ? "bg-[#ffe66d]"
                        : "bg-white"
                      }`}
                  >
                    <CpuChipIcon className="h-5 w-5" />
                    Manual
                  </button>
                </div>

                {creationMode === "ai" ? (
                  <div className="space-y-6">
                    <AICommandBar
                      onSubmit={handleAiSubmit}
                      loading={aiLoading}
                    />
                    {aiPreview && (
                      <WorkflowPreview
                        preview={aiPreview}
                        onExecute={handleAiExecute}
                        executing={aiExecuting}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {/* FLOW VISUAL */}
                    <div className="mb-10 flex flex-col items-center justify-center gap-5 rounded-[2rem] border-[4px] border-dashed border-black bg-[#f8f8f8] p-8 lg:flex-row">
                      <div className="rounded-2xl border-[3px] border-black bg-[#ffe66d] px-6 py-4 font-black uppercase shadow-[4px_4px_0px_#000]">
                        Trigger
                      </div>

                      <ArrowPathIcon className="h-8 w-8" />

                      <div className="rounded-2xl border-[3px] border-black bg-[#7df9ff] px-6 py-4 font-black uppercase shadow-[4px_4px_0px_#000]">
                        AI Processing
                      </div>

                      <ArrowPathIcon className="h-8 w-8" />

                      <div className="rounded-2xl border-[3px] border-black bg-[#9cff57] px-6 py-4 font-black uppercase shadow-[4px_4px_0px_#000]">
                        Execute Action
                      </div>
                    </div>

                    {/* FORM */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <input
                        value={workflowName}
                        onChange={(e) =>
                          setWorkflowName(e.target.value)
                        }
                        placeholder="Workflow Name"
                        className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none focus:shadow-[4px_4px_0px_#000] focus:-translate-y-0.5 transition-all"
                      />

                      <select
                        value={workflowTrigger}
                        onChange={(e) =>
                          setWorkflowTrigger(e.target.value)
                        }
                        className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none"
                      >
                        {triggers.map((trigger) => (
                          <option
                            key={trigger.value}
                            value={trigger.value}
                          >
                            {trigger.label}
                          </option>
                        ))}
                      </select>

                      <textarea
                        value={workflowDescription}
                        onChange={(e) =>
                          setWorkflowDescription(e.target.value)
                        }
                        placeholder="Workflow Description"
                        rows={5}
                        className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none lg:col-span-2 focus:shadow-[4px_4px_0px_#000] focus:-translate-y-0.5 transition-all"
                      />

                      <select
                        value={workflowActionType}
                        onChange={(e) =>
                          setWorkflowActionType(e.target.value)
                        }
                        className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none"
                      >
                        {actionTypes.map((action) => (
                          <option
                            key={action.value}
                            value={action.value}
                          >
                            {action.label}
                          </option>
                        ))}
                      </select>

                      {workflowActionType === "update_task_status" && (
                        <select
                          value={workflowActionStatus}
                          onChange={(e) => setWorkflowActionStatus(e.target.value)}
                          className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      )}

                      {workflowActionType === "update_task_priority" && (
                        <select
                          value={workflowActionPriority}
                          onChange={(e) => setWorkflowActionPriority(e.target.value)}
                          className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      )}

                      {workflowActionType === "create_task" && (
                        <input
                          value={workflowActionTitle}
                          onChange={(e) => setWorkflowActionTitle(e.target.value)}
                          placeholder="Follow-up task title"
                          className="rounded-2xl border-[3px] border-black p-4 text-lg font-medium outline-none lg:col-span-2"
                        />
                      )}

                      <button
                        type="button"
                        onClick={createWorkflow}
                        disabled={creatingManual}
                        className="rounded-2xl border-[3px] border-black bg-[#7df9ff] px-6 py-4 text-lg font-black uppercase shadow-[6px_6px_0px_#000] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000] disabled:opacity-50"
                      >
                        {creatingManual ? "Creating…" : "Create Workflow"}
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* WORKFLOW LIST */}
            <div className="grid gap-6">
              {workflows.length === 0 &&
                !loading ? (
                <div className="rounded-[3rem] border-[4px] border-dashed border-black bg-white p-12 text-center shadow-[10px_10px_0px_#000]">
                  <CpuChipIcon className="mx-auto h-20 w-20" />

                  <SectionHeading className="mt-6">
                    No workflows yet
                  </SectionHeading>

                  <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-black/70">
                    Create intelligent automations that transform repetitive
                    operations into AI-powered workflow systems.
                  </p>
                </div>
              ) : (
                workflows.map((workflow) => {
                  const actions = normalizeWorkflowActions(workflow.actions)

                  return (
                  <div
                    key={workflow.id}
                    className="rounded-[3rem] border-[4px] border-black bg-white p-7 shadow-[10px_10px_0px_#000]"
                  >
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex-1">
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                          <h2 className="text-3xl font-black uppercase">
                            {workflow.name}
                          </h2>

                          <span className="rounded-full border-[3px] border-black bg-[#ffe66d] px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_#000]">
                            {workflow.trigger.replace(
                              /_/g,
                              " "
                            )}
                          </span>
                        </div>

                        <p className="max-w-3xl text-lg leading-8 text-black/70">
                          {workflow.description}
                        </p>

                        {/* FLOW CHAIN */}
                        <div className="mt-7 flex flex-wrap items-center gap-4">
                          <div className="rounded-2xl border-[3px] border-black bg-[#ffe66d] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000]">
                            Trigger
                          </div>

                          <ArrowPathIcon className="h-5 w-5" />

                          <div className="rounded-2xl border-[3px] border-black bg-[#7df9ff] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000]">
                            AI Logic
                          </div>

                          <ArrowPathIcon className="h-5 w-5" />

                          <div className="rounded-2xl border-[3px] border-black bg-[#9cff57] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000]">
                            Execute
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <span className="rounded-full border-[3px] border-black bg-[#7df9ff] px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_#000]">
                            Actions:
                            {" "}
                            {actions.length}
                          </span>

                          <span
                            className={`rounded-full border-[3px] border-black px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_#000] ${workflow.isActive
                                ? "bg-[#9cff57]"
                                : "bg-[#ff8ad8]"
                              }`}
                          >
                            {workflow.isActive
                              ? "Active"
                              : "Paused"}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleWorkflow(
                              workflow.id,
                              workflow.isActive
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-black bg-[#ffe66d] px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0px_#000]"
                        >
                          {workflow.isActive ? (
                            <PauseIcon className="h-5 w-5" />
                          ) : (
                            <PlayIcon className="h-5 w-5" />
                          )}

                          {workflow.isActive
                            ? "Pause"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteWorkflow(
                              workflow.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-black bg-[#ff8ad8] px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0px_#000]"
                        >
                          <TrashIcon className="h-5 w-5" />
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => runWorkflowNow(workflow.id)}
                          disabled={runningWorkflowId === workflow.id}
                          className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-black bg-[#7df9ff] px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0px_#000] disabled:opacity-50"
                        >
                          <BoltIcon className="h-5 w-5" />
                          {runningWorkflowId === workflow.id ? "Running…" : "Run Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                )})
              )}
            </div>
        </PageShell>
      </Sidebar>
    </RequireAuth>
  )
}