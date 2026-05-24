import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  actions?: ReactNode
}

/** Mid-scale neo-brutalist page title — bold theme type, not hero-sized */
export default function PageHeader({
  title,
  description,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b-[3px] border-black/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {badge && (
          <span className="mb-3 inline-flex rotate-[-1deg] rounded-full border-[3px] border-black bg-[#ff8ad8] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-[3px_3px_0px_#000]">
            {badge}
          </span>
        )}
        <h1 className="font-black uppercase leading-[0.95] tracking-[-0.04em] text-black text-[2.5rem] sm:text-[3.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pb-1">
          {actions}
        </div>
      )}
    </header>
  )
}

/** In-page section labels (templates, lists, etc.) */
export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={`text-2xl font-black uppercase tracking-tight text-black sm:text-3xl ${className}`}
    >
      {children}
    </h2>
  )
}
