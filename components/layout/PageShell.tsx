import type { ReactNode } from "react"

interface PageShellProps {
  children: ReactNode
  className?: string
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`relative mx-auto max-w-6xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
