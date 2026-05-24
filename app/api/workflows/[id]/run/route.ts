import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { runWorkflowNow } from "@/services/workflowService"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const result = await runWorkflowNow(id, user.userId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Run workflow error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    const status = message === "Workflow not found" ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
