import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { getProjects, createProject } from "@/services/projectService"

export async function GET(req: Request) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const projects = await getProjects(user.userId)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    if (!body.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    const project = await createProject({
      name: body.name,
      userId: user.userId,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
