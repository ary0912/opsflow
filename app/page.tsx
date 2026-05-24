import type { Metadata } from "next"

import LandingPage from "@/components/LandingPage"

export const metadata: Metadata = {
  title:
    "OpsFlow — Intelligent Workflow OS",

  description:
    "AI-powered workflow automation platform built for intelligent operations, task orchestration, analytics, and modern team collaboration.",
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <LandingPage />
    </main>
  )
}