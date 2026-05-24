import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { getActivityLogs } from "@/services/activityService"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const offset = parseInt(searchParams.get("offset") || "0")

  try {
    const activities = await getActivityLogs(user.userId, limit, offset)
    return NextResponse.json(activities)
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}