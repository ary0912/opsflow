interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={
        "h-12 w-full rounded-[1.2rem] border-[3px] border-black bg-[#f6f0e4] px-4 text-sm font-semibold text-black outline-none transition-all placeholder:text-zinc-500 focus:-translate-y-0.5 focus:bg-white focus:shadow-[4px_4px_0px_#000] " +
        className
      }
      {...props}
    />
  )
}
