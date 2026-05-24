interface BadgeProps {
  variant?: "neutral" | "success" | "warning" | "accent" | "danger"
  className?: string
  children: React.ReactNode
}

const variantStyles = {
  neutral: "bg-white border-black text-black",
  success: "bg-[#9cff57] border-black text-black",
  warning: "bg-[#ffe66d] border-black text-black",
  accent: "bg-[#7df9ff] border-black text-black",
  danger: "bg-[#ff8ad8] border-black text-black",
}

export default function Badge({ variant = "neutral", className = "", children }: BadgeProps) {
  return (
    <span className={"inline-flex items-center rounded-full border-[2px] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] " + variantStyles[variant] + " " + className}>
      {children}
    </span>
  )
}
