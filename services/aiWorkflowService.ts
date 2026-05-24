import { parseWorkflowPrompt, ParsedAiWorkflow } from "@/services/openAiService"
import { createAIConversation } from "@/services/aiConversationService"
import { createWorkflow } from "@/services/workflowService"
import { createTask } from "@/services/taskService"
import { getProjects, createProject } from "@/services/projectService"

interface AiWorkflowResult {
  preview: ParsedAiWorkflow
  createdWorkflowId?: string
  createdTaskIds?: string[]
}

type ParsedAiWorkflowTask = NonNullable<ParsedAiWorkflow["tasks"]>[number]

async function findOrCreateProject(userId: string, projectName: string) {
  const projects = await getProjects(userId)
  const match = projects.find((project) => project.name.toLowerCase() === projectName.toLowerCase())
  if (match) return match.id
  const created = await createProject({ name: projectName, userId })
  return created.id
}

function normalizeTaskPayload(task: ParsedAiWorkflowTask, projectId?: string) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  return {
    title: task.title,
    status: task.status || "todo",
    priority: task.priority || "medium",
    dueDate: dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : undefined,
    projectId,
  }
}

async function logConversation(
  userId: string,
  prompt: string,
  parsed: ParsedAiWorkflow
) {
  try {
    await createAIConversation(userId, prompt, parsed, parsed.name)
  } catch (error) {
    console.warn("Could not log AI conversation:", error)
  }
}

export async function previewAiWorkflow(prompt: string, userId: string) {
  const parsed = await parseWorkflowPrompt(prompt)
  await logConversation(userId, prompt, parsed)
  return { preview: parsed }
}

export async function createAiWorkflow(prompt: string, userId: string, projectId?: string) {
  const parsed = await parseWorkflowPrompt(prompt)
  await logConversation(userId, prompt, parsed)

  const workflow = await createWorkflow({
    name: parsed.name,
    description: parsed.description,
    trigger: parsed.trigger,
    conditions: parsed.conditions,
    actions: parsed.actions,
    projectId,
    userId,
  })

  const createdTaskIds: string[] = []
  if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
    for (const task of parsed.tasks) {
      const targetProjectId = task.projectName ? await findOrCreateProject(userId, task.projectName) : projectId
      const taskPayload = normalizeTaskPayload(task, targetProjectId)
      const createdTask = await createTask({
        ...taskPayload,
        userId,
      })
      createdTaskIds.push(createdTask.id)
    }
  }

  return {
    preview: parsed,
    workflow,
    createdTaskIds,
  }
}
