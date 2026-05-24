import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { updateTask, deleteTask } from "@/services/taskService"

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

    const updatedTask = await updateTask(id, user.userId, body)

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Update task error:", error)

    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
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

    await deleteTask(id, user.userId)

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)

    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}