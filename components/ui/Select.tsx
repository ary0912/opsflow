interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

export default function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={
        "h-12 w-full rounded-[1.2rem] border-[3px] border-black bg-[#f6f0e4] px-4 text-sm font-semibold text-black outline-none transition-all focus:-translate-y-0.5 focus:bg-white focus:shadow-[4px_4px_0px_#000] cursor-pointer " +
        className
      }
      {...props}
    />
  )
}
