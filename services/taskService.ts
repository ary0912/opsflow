import prisma from "@/lib/prisma"
import type { TaskData } from "./workflowService"
import { getActiveWorkflowsByTrigger, executeWorkflowActions, checkWorkflowConditions } from "./workflowService"
import { logTaskActivity } from "./activityService"

export interface TaskFilters {
  status?: string
  priority?: string
  projectId?: string
}

export interface CreateTaskData {
  title: string
  status?: string
  priority?: string
  dueDate?: Date
  userId: string
  projectId?: string
}

export interface UpdateTaskData {
  title?: string
  status?: string
  priority?: string
}

export async function getTasks(userId: string, filters: TaskFilters = {}) {
  const { status, priority, projectId } = filters

  return await prisma.task.findMany({
    where: {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
    },
    include: {
      project: true, // Include project info
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createTask(data: CreateTaskData) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      status: data.status || "todo",
      priority: data.priority || "medium",
      dueDate: data.dueDate,
      userId: data.userId,
      projectId: data.projectId,
    },
    include: {
      project: true,
    },
  })

  // Log activity
  await logTaskActivity(data.userId, "created_task", task.id, task)

  // Trigger workflows
  await triggerWorkflows("task_created", task, data.userId)

  return task
}

export async function updateTask(taskId: string, userId: string, data: UpdateTaskData) {
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { project: true },
  })

  if (!existingTask) {
    throw new Error("Task not found")
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      project: true,
    },
  })

  // Log activity
  await logTaskActivity(userId, "updated_task", taskId, updatedTask)

  // Trigger workflows for task updates
  await triggerWorkflows("task_updated", updatedTask, userId)

  // Check for specific status changes
  if (data.status && data.status !== existingTask.status) {
    if (data.status === "done") {
      await triggerWorkflows("task_completed", updatedTask, userId)
    }
  }

  return updatedTask
}

export async function deleteTask(taskId: string, userId: string) {
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { project: true },
  })

  if (!existingTask) {
    throw new Error("Task not found")
  }

  // Log activity before deletion
  await logTaskActivity(userId, "deleted_task", taskId, existingTask)

  return await prisma.task.delete({
    where: { id: taskId },
  })
}

async function triggerWorkflows(trigger: string, taskData: TaskData, userId: string) {
  try {
    const workflows = await getActiveWorkflowsByTrigger(trigger, userId, taskData.projectId as string | undefined)

    for (const workflow of workflows) {
      if (checkWorkflowConditions(workflow, taskData)) {
        await executeWorkflowActions(workflow, taskData, userId)
      }
    }
  } catch (error) {
    console.error("Error triggering workflows:", error)
    // Don't fail the main operation if workflow execution fails
  }
}