import { verifyToken } from "./auth"

export function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization")

  // If no auth header is present, return a default public user.
  // This allows the app to work without a login flow.
  if (!authHeader) {
    return { userId: "public" } as any
  }

  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)

  return decoded || ({ userId: "public" } as any)
}