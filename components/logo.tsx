import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({
  showText = true,
  className,
}: {
  showText?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShieldCheck className="size-5" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold tracking-tight">
            SentinelAI
          </span>
          <span className="text-[11px] text-muted-foreground">
            Email Threat Defense
          </span>
        </div>
      )}
    </div>
  )
}
