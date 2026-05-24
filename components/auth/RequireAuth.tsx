"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/authClient"

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [ready] = useState<boolean>(() => {
    try {
      return Boolean(getAuthToken())
    } catch {
      return false
    }
  })
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p>Checking your session...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
