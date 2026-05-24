import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { updateProject, deleteProject } from "@/services/projectService"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id } = await params

    if (!body.name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const updatedProject = await updateProject(id, user.userId, {
      name: body.name,
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)

    if (error instanceof Error && error.message.includes("Project not found")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await deleteProject(id, user.userId)
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)

    if (error instanceof Error && error.message.includes("Project not found")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
