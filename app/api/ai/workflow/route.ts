import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { createAiWorkflow, previewAiWorkflow } from "@/services/aiWorkflowService"

export async function POST(req: Request) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const prompt = body.prompt
  const mode = body.mode === "execute" ? "execute" : "preview"
  const projectId = body.projectId

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  try {
    if (mode === "execute") {
      const result = await createAiWorkflow(prompt, user.userId, projectId)
      return NextResponse.json(result)
    }

    const preview = await previewAiWorkflow(prompt, user.userId)
    return NextResponse.json(preview)
  } catch (error) {
    console.error("AI workflow error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
