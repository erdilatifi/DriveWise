"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

function getStrength(password: string) {
  if (!password) return 0
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const LABELS = ["Shumë i dobët", "I dobët", "Mesatar", "I fortë", "Shumë i fortë"]
const BAR_COLORS = ["bg-destructive", "bg-orange-500", "bg-amber-400", "bg-emerald-500"]

export function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => getStrength(password), [password])

  if (!password) return null

  const barColor = BAR_COLORS[Math.max(strength - 1, 0)]

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-border/60 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                i < strength ? barColor : "w-0"
              )}
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">{LABELS[strength]}</p>
    </div>
  )
}
