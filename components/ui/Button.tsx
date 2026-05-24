interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning" | "accent" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  className?: string
}

const variantStyles = {
  primary: "bg-[#7df9ff] border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]",
  secondary: "bg-[#ff8ad8] border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]",
  warning: "bg-[#ffe66d] border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]",
  accent: "bg-[#9cff57] border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]",
  ghost: "bg-transparent border-transparent hover:border-black hover:bg-black/5 text-black hover:shadow-[4px_4px_0px_#000] active:translate-y-0 active:shadow-none hover:translate-y-0",
  danger: "bg-[#ff6b6b] border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]",
}

const sizeStyles = {
  sm: "h-9 px-4 text-xs font-black uppercase tracking-wider rounded-[0.95rem]",
  md: "h-11 px-5 text-sm font-black uppercase tracking-wider rounded-[1.2rem]",
  lg: "h-13 px-7 text-base font-black uppercase tracking-widest rounded-[1.5rem]",
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isGhost = variant === "ghost"
  return (
    <button
      type={type}
      className={
        "inline-flex items-center justify-center border-[3px] font-black uppercase transition-all duration-100 select-none disabled:opacity-50 disabled:pointer-events-none " +
        (!isGhost ? "hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] " : "") +
        variantStyles[variant] +
        " " +
        sizeStyles[size] +
        " " +
        className
      }
      {...props}
    />
  )
}
