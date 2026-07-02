import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"

export interface IconInputProps extends InputProps {
  icon: React.ReactNode
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <Input ref={ref} className={cn("pl-10", className)} {...props} />
    </div>
  )
)
IconInput.displayName = "IconInput"

export { IconInput }
