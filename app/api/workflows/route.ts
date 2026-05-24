import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { getWorkflows, createWorkflow } from "@/services/workflowService"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId") || undefined

  try {
    const workflows = await getWorkflows(user.userId, projectId)
    return NextResponse.json(workflows)
  } catch (error) {
    console.error("Get workflows error:", error)
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

    if (!body.name || !body.trigger || !body.actions) {
      return NextResponse.json(
        { error: "Name, trigger, and actions are required" },
        { status: 400 }
      )
    }

    const workflow = await createWorkflow({
      name: body.name,
      description: body.description,
      trigger: body.trigger,
      conditions: body.conditions,
      actions: body.actions,
      projectId: body.projectId,
      userId: user.userId,
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error("Create workflow error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}