import prisma from "@/lib/prisma"

export interface WorkflowCondition {
  field: string
  operator: string
  value: unknown
}

export interface WorkflowAction {
  type: string
  params: Record<string, unknown>
}

export type TaskData = {
  id: string
  title: string
  status: string
  priority: string
  projectId?: string | null
  [key: string]: unknown
}

export interface CreateWorkflowData {
  name: string
  description?: string
  trigger: string
  conditions?: WorkflowCondition[]
  actions: WorkflowAction[]
  projectId?: string
  userId: string
}

export interface UpdateWorkflowData {
  name?: string
  description?: string
  trigger?: string
  conditions?: WorkflowCondition[]
  actions?: WorkflowAction[]
  isActive?: boolean
}

export async function getWorkflows(userId: string, projectId?: string) {
  return await prisma.workflow.findMany({
    where: {
      userId,
      ...(projectId && { projectId }),
    },
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createWorkflow(data: CreateWorkflowData) {
  return await prisma.workflow.create({
    data: {
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      conditions: data.conditions ? JSON.parse(JSON.stringify(data.conditions)) : null,
      actions: JSON.parse(JSON.stringify(data.actions)),
      userId: data.userId,
      projectId: data.projectId,
    },
    include: {
      project: true,
    },
  })
}

export async function updateWorkflow(workflowId: string, userId: string, data: UpdateWorkflowData) {
  const existingWorkflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  })

  if (!existingWorkflow) {
    throw new Error("Workflow not found")
  }

  return await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      ...data,
      conditions: data.conditions ? JSON.parse(JSON.stringify(data.conditions)) : undefined,
      actions: data.actions ? JSON.parse(JSON.stringify(data.actions)) : undefined,
    },
    include: {
      project: true,
    },
  })
}

export async function deleteWorkflow(workflowId: string, userId: string) {
  const existingWorkflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  })

  if (!existingWorkflow) {
    throw new Error("Workflow not found")
  }

  return await prisma.workflow.delete({
    where: { id: workflowId },
  })
}

export async function getActiveWorkflowsByTrigger(trigger: string, userId: string, projectId?: string) {
  return await prisma.workflow.findMany({
    where: {
      trigger,
      isActive: true,
      userId,
      ...(projectId && { projectId }),
    },
    include: {
      project: true,
    },
  })
}

export async function executeWorkflowActions(workflow: { actions?: unknown }, taskData: TaskData, userId: string) {
  const actions = Array.isArray(workflow.actions) ? (workflow.actions as WorkflowAction[]) : []

  for (const action of actions) {
    await executeWorkflowAction(action, taskData, userId)
  }
}

async function executeWorkflowAction(action: WorkflowAction, taskData: TaskData, userId: string) {
  switch (action.type) {
    case "update_task_status": {
      const status = action.params.status as string | undefined
      if (typeof status === "string") {
        await prisma.task.update({
          where: {
            id: taskData.id,
            userId,
          },
          data: {
            status,
          },
        })
      }
      break
    }

    case "update_task_priority": {
      const priority = action.params.priority as string | undefined
      if (typeof priority === "string") {
        await prisma.task.update({
          where: {
            id: taskData.id,
            userId,
          },
          data: {
            priority,
          },
        })
      }
      break
    }

    case "move_to_project": {
      const projectId = action.params.projectId as string | undefined
      await prisma.task.update({
        where: {
          id: taskData.id,
          userId,
        },
        data: {
          projectId,
        },
      })
      break
    }

    case "create_task": {
      const title = typeof action.params.title === "string"
        ? action.params.title
        : `Auto-created from workflow: ${taskData.title}`
      const status = typeof action.params.status === "string"
        ? action.params.status
        : "todo"
      const priority = typeof action.params.priority === "string"
        ? action.params.priority
        : "medium"
      const projectId = typeof action.params.projectId === "string"
        ? action.params.projectId
        : taskData.projectId

      await prisma.task.create({
        data: {
          title,
          status,
          priority,
          userId,
          projectId,
        },
      })
      break
    }

    default:
      console.log(`Unknown workflow action: ${action.type}`)
  }
}

export async function runWorkflowNow(workflowId: string, userId: string) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  })

  if (!workflow) {
    throw new Error("Workflow not found")
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(workflow.projectId ? { projectId: workflow.projectId } : {}),
    },
  })

  let tasksAffected = 0

  for (const task of tasks) {
    const taskData = task as TaskData
    if (checkWorkflowConditions(workflow, taskData)) {
      await executeWorkflowActions(workflow, taskData, userId)
      tasksAffected += 1
    }
  }

  return {
    workflowId: workflow.id,
    workflowName: workflow.name,
    tasksScanned: tasks.length,
    tasksAffected,
  }
}

export function checkWorkflowConditions(workflow: { conditions?: unknown }, taskData: TaskData): boolean {
  if (!workflow.conditions || !Array.isArray(workflow.conditions) || workflow.conditions.length === 0) {
    return true
  }

  const conditions = workflow.conditions as WorkflowCondition[]

  return conditions.every(condition => {
    const fieldValue = taskData[condition.field]
    const expectedValue = condition.value

    switch (condition.operator) {
      case "equals":
        return fieldValue === expectedValue
      case "not_equals":
        return fieldValue !== expectedValue
      case "contains":
        return String(fieldValue).includes(String(expectedValue))
      case "greater_than":
        return Number(fieldValue) > Number(expectedValue)
      case "less_than":
        return Number(fieldValue) < Number(expectedValue)
      default:
        return false
    }
  })
}