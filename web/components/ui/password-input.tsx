"use client"

import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  icon?: React.ReactNode
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 [&_svg]:h-4 [&_svg]:w-4">
          {icon ?? <Lock />}
        </span>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pl-10 pr-10", className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
          aria-label={visible ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
