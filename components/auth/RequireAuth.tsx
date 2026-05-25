"use client"

import { ReactNode } from "react"

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  // Authentication disabled: always render children
  return <>{children}</>
}
