import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user exists (only select id for performance)
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true } // Only select needed fields
    })

    // Generate token
    const token = signToken(user.id)

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: { id: user.id, email: user.email }
    })
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
