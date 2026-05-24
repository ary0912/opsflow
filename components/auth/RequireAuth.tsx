"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/authClient"

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [ready, setReady] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efe7da] text-black">
        <div className="flex flex-col items-center gap-3 rounded-[2rem] border-[4px] border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/15 border-t-black" />
          <p className="font-black uppercase tracking-wider text-xs mt-2">Checking your session...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
