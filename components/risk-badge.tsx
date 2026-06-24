import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RISK_META } from "@/lib/risk"
import type { RiskLevel } from "@/lib/types"

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel
  className?: string
}) {
  const meta = RISK_META[level]
  return (
    <Badge
      variant="ghost"
      className={cn("gap-1.5 font-medium", meta.bg, className)}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </Badge>
  )
}
