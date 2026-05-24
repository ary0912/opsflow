import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { updateWorkflow, deleteWorkflow } from "@/services/workflowService"

export const runtime = "nodejs"

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
    const updatedWorkflow = await updateWorkflow(id, user.userId, body)
    return NextResponse.json(updatedWorkflow)
  } catch (error) {
    console.error("Update workflow error:", error)
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
    await deleteWorkflow(id, user.userId)
    return NextResponse.json({ message: "Workflow deleted successfully" })
  } catch (error) {
    console.error("Delete workflow error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
