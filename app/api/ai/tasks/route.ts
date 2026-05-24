import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const action = body.action === "optimize" ? "optimize" : "prioritize"

    const tasks = await prisma.task.findMany({
      where: { userId: user.userId },
    })

    if (action === "prioritize") {
      let updated = 0
      for (const task of tasks) {
        if (task.status === "done" || task.priority === "high") continue
        const isOverdue = Boolean(task.dueDate && task.dueDate < new Date())
        if (!isOverdue && task.status === "todo" && task.priority === "medium") continue

        await prisma.task.update({
          where: { id: task.id },
          data: { priority: "high" },
        })
        updated += 1
      }

      return NextResponse.json({
        action,
        message: `Elevated priority on ${updated} task${updated === 1 ? "" : "s"}.`,
        updated,
      })
    }

    let updated = 0
    for (const task of tasks) {
      if (task.status === "todo" && task.priority === "high") {
        await prisma.task.update({
          where: { id: task.id },
          data: { status: "in_progress" },
        })
        updated += 1
      }
    }

    return NextResponse.json({
      action,
      message: `Moved ${updated} high-priority task${updated === 1 ? "" : "s"} into progress.`,
      updated,
    })
  } catch (error) {
    console.error("AI Optimize error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
