import { z } from "zod"

const WorkflowConditionSchema = z.object({
  field: z.string(),
  operator: z.string(),
  value: z.any(),
})

const WorkflowActionSchema = z.object({
  type: z.string(),
  params: z.record(z.string(), z.any()),
})

const GeneratedTaskSchema = z.object({
  title: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  projectName: z.string().optional(),
})

export const AiWorkflowParseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  trigger: z.string(),
  conditions: z.array(WorkflowConditionSchema).optional().default([]),
  actions: z.array(WorkflowActionSchema).min(1),
  tasks: z.array(GeneratedTaskSchema).optional(),
})

export type ParsedAiWorkflow = z.infer<typeof AiWorkflowParseSchema>

export function buildFallbackWorkflow(prompt: string): ParsedAiWorkflow {
  const lower = prompt.toLowerCase()

  const trigger =
    lower.includes("completed") || lower.includes("complete")
      ? "task_completed"
      : lower.includes("updated") || lower.includes("change")
        ? "task_updated"
        : "task_created"

  const actions: ParsedAiWorkflow["actions"] = []

  if (
    lower.includes("priority") ||
    lower.includes("urgent") ||
    lower.includes("escalat") ||
    lower.includes("bug") ||
    lower.includes("triage")
  ) {
    actions.push({
      type: "update_task_priority",
      params: { priority: "high" },
    })
  }

  if (
    lower.includes("review") ||
    lower.includes("progress") ||
    lower.includes("move") ||
    lower.includes("sprint") ||
    lower.includes("qa")
  ) {
    actions.push({
      type: "update_task_status",
      params: { status: lower.includes("done") ? "done" : "in_progress" },
    })
  }

  if (
    lower.includes("create") ||
    lower.includes("follow-up") ||
    lower.includes("follow up") ||
    lower.includes("onboarding")
  ) {
    actions.push({
      type: "create_task",
      params: {
        title: "Follow-up task from automation",
        status: "todo",
        priority: "medium",
      },
    })
  }

  if (actions.length === 0) {
    actions.push({
      type: "update_task_priority",
      params: { priority: "high" },
    })
  }

  const tasks: ParsedAiWorkflow["tasks"] = []
  if (lower.includes("onboarding")) {
    tasks.push(
      {
        title: "Prepare onboarding checklist",
        status: "todo",
        priority: "high",
        projectName: "Onboarding",
      },
      {
        title: "Schedule kickoff meeting",
        status: "todo",
        priority: "medium",
        projectName: "Onboarding",
      }
    )
  }

  const trimmed = prompt.trim()
  const name =
    trimmed.length > 48 ? `${trimmed.slice(0, 45)}...` : trimmed || "Custom automation"

  return {
    name,
    description: `Automation: ${trimmed.slice(0, 120) || "workspace rule"}`,
    trigger,
    conditions: [],
    actions,
    tasks: tasks.length > 0 ? tasks : undefined,
  }
}

function extractJson(text: string) {
  const codeBlock = text.match(/```json\s*([\s\S]*?)\s*```/i)
  if (codeBlock?.[1]) {
    return codeBlock[1].trim()
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  return jsonMatch ? jsonMatch[0] : text.trim()
}

async function fetchOpenAiResponse(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return JSON.stringify(buildFallbackWorkflow(prompt))
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI workflow architect for OpsFlow. Convert natural language workflow instructions into structured JSON that can be saved as a workflow and task plan. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 700,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI request failed: ${errorText}`)
  }

  const result = await response.json()
  const content = result?.choices?.[0]?.message?.content
  if (typeof content !== "string") {
    throw new Error("OpenAI response did not return text content")
  }

  return content
}

function normalizeParsedWorkflow(raw: unknown): ParsedAiWorkflow {
  const parsed = AiWorkflowParseSchema.parse(raw)
  return {
    ...parsed,
    conditions: parsed.conditions ?? [],
    description: parsed.description ?? "",
  }
}

export async function parseWorkflowPrompt(prompt: string) {
  const instruction = `Convert the following user instruction into a valid JSON workflow definition for OpsFlow. Only return JSON.

User instruction:
${prompt}

Required fields: name, description, trigger (task_created|task_updated|task_completed), actions (array with type and params).
Optional: conditions, tasks.

Supported action types: update_task_status, update_task_priority, create_task, move_to_project.
`

  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackWorkflow(prompt)
  }

  try {
    const raw = await fetchOpenAiResponse(instruction)
    const jsonString = extractJson(raw)
    const parsed = JSON.parse(jsonString)
    return normalizeParsedWorkflow(parsed)
  } catch (error) {
    console.warn("AI parse failed, using fallback:", error)
    return buildFallbackWorkflow(prompt)
  }
}
