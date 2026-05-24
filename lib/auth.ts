import jwt from "jsonwebtoken"

export function signToken(userId: string) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }
  } catch {
    return null
  }
}