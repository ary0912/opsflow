import type { Metadata, Viewport } from "next"
import "./globals.css"
import CommandPalette from "@/components/ui/CommandPalette"
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL("https://opsflow.ai"),

  title: {
    default:
      "OpsFlow — Intelligent Workflow OS",
    template:
      "%s • OpsFlow",
  },

  description:
    "OpsFlow is a modern intelligent workflow operating system built for automation, task orchestration, AI-powered collaboration, analytics, and operational workflows.",

  keywords: [
    "OpsFlow",
    "Workflow Automation",
    "AI Workflow Platform",
    "Task Management",
    "Kanban",
    "Workflow OS",
    "Automation Platform",
    "Next.js SaaS",
    "Team Collaboration",
    "AI Operations",
    "Workflow Analytics",
    "Productivity Platform",
  ],

  authors: [
    {
      name: "Aryan Lodha",
    },
  ],

  creator: "Aryan Lodha",

  openGraph: {
    title:
      "OpsFlow — Intelligent Workflow OS",

    description:
      "Modern workflow automation platform with AI-powered operations, analytics, collaboration, and automation systems.",

    url: "https://opsflow.ai",

    siteName: "OpsFlow",

    locale: "en_GB",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "OpsFlow — Intelligent Workflow OS",

    description:
      "AI-powered workflow automation platform for modern operational teams.",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffe66d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <body className="min-h-screen overflow-x-hidden bg-[#ffe66d] font-sans text-black antialiased">
        {/* GLOBAL RETRO BACKGROUND */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-50 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
            `,
            backgroundSize:
              "56px 56px",
          }}
        />

        {/* GLOBAL GLOW */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-40 overflow-hidden"
        >
          <div className="absolute left-[-120px] top-[80px] h-[320px] w-[320px] rounded-full bg-[#7df9ff] opacity-20 blur-[120px]" />

          <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#ff8ad8] opacity-20 blur-[120px]" />

          <div className="absolute left-[40%] top-[30%] h-[260px] w-[260px] rounded-full bg-[#ffd166] opacity-10 blur-[120px]" />
        </div>

        {/* APP */}
        <div className="relative flex min-h-screen flex-col">
          {children}
          <CommandPalette />
        </div>
        <Analytics />
      </body>
    </html>
  )
}