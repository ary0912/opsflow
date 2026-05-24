import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { getTasks, createTask } from "@/services/taskService"

export async function GET(req: Request) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const status = searchParams.get("status") || undefined
  const priority = searchParams.get("priority") || undefined
  const projectId = searchParams.get("projectId") || undefined

  try {
    const tasks = await getTasks(user.userId, { status, priority, projectId })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
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

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const task = await createTask({
      title: body.title,
      status: body.status,
      priority: body.priority,
      userId: user.userId,
      projectId: body.projectId,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}