import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-muted/60 via-muted/35 to-muted/60",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-primary/18 before:to-transparent before:animate-[shimmer_1.4s_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
