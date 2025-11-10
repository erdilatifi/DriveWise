import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card/50 backdrop-blur-xl border border-border",
        "shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
