import prisma from "@/lib/prisma"

export interface CreateActivityData {
  userId: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
}

export async function getActivityLogs(userId: string, limit: number = 50, offset: number = 0) {
  return await prisma.activityLog.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  })
}

export async function getActivityLogsByEntity(entityType: string, entityId: string, limit: number = 20) {
  return await prisma.activityLog.findMany({
    where: {
      entityType,
      entityId,
    },
    include: {
      user: {
        select: { id: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function createActivityLog(data: CreateActivityData) {
  return await prisma.activityLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
    },
  })
}

export async function logTaskActivity(userId: string, action: string, taskId: string, taskData?: Record<string, unknown>) {
  const metadata = taskData ? {
    title: taskData.title,
    status: taskData.status,
    priority: taskData.priority,
    projectId: taskData.projectId,
  } : undefined

  return await createActivityLog({
    userId,
    action,
    entityType: "task",
    entityId: taskId,
    metadata,
  })
}

export async function logProjectActivity(userId: string, action: string, projectId: string, projectData?: Record<string, unknown>) {
  const metadata = projectData ? {
    name: projectData.name,
  } : undefined

  return await createActivityLog({
    userId,
    action,
    entityType: "project",
    entityId: projectId,
    metadata,
  })
}

export async function logWorkflowActivity(userId: string, action: string, workflowId: string, workflowData?: Record<string, unknown>) {
  const metadata = workflowData ? {
    name: workflowData.name,
    trigger: workflowData.trigger,
  } : undefined

  return await createActivityLog({
    userId,
    action,
    entityType: "workflow",
    entityId: workflowId,
    metadata,
  })
}