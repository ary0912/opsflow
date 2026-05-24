import prisma from "@/lib/prisma"

export interface CreateProjectData {
  name: string
  userId: string
}

export interface UpdateProjectData {
  name?: string
}

export async function getProjects(userId: string) {
  return await prisma.project.findMany({
    where: { userId },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function createProject(data: CreateProjectData) {
  return await prisma.project.create({
    data: {
      name: data.name,
      userId: data.userId,
    },
    include: {
      tasks: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
}

export async function updateProject(projectId: string, userId: string, data: UpdateProjectData) {
  const existingProject = await prisma.project.findFirst({
    where: { id: projectId, userId },
  })

  if (!existingProject) {
    throw new Error("Project not found")
  }

  return await prisma.project.update({
    where: { id: projectId },
    data,
    include: {
      tasks: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
}

export async function deleteProject(projectId: string, userId: string) {
  const existingProject = await prisma.project.findFirst({
    where: { id: projectId, userId },
  })

  if (!existingProject) {
    throw new Error("Project not found")
  }

  return await prisma.project.delete({
    where: { id: projectId },
  })
}

export async function getProjectById(projectId: string, userId: string) {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { tasks: true }
      }
    }
  })
}