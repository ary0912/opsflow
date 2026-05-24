import type { ComponentType, SVGProps } from "react"

interface StatCardProps {
  label: string
  value: string | number
  color?: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  hint?: string
}

export default function StatCard({
  label,
  value,
  color = "#7df9ff",
  icon: Icon,
  hint,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-black/55">
          {label}
        </p>
        {Icon && (
          <Icon className="h-5 w-5 shrink-0 text-black/70" aria-hidden />
        )}
      </div>
      <p className="mt-2 text-3xl font-black tabular-nums text-black">{value}</p>
      {hint && (
        <p className="mt-1 text-[10px] font-semibold text-black/45">{hint}</p>
      )}
    </div>
  )
}
