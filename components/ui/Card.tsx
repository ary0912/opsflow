interface CardProps {
  className?: string
  children: React.ReactNode
}

export default function Card({ className = "", children }: CardProps) {
  return (
    <div className={"rounded-[2rem] border-[4px] border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden " + className}>
      {children}
    </div>
  )
}
