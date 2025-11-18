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
        "relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-2xl",
        "shadow-[0_22px_70px_rgba(0,0,0,0.9)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.06),transparent_55%)] before:opacity-70",
        hover && "transition-all duration-300 hover:shadow-[0_28px_90px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
