import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/risk"
import { Card, CardContent } from "@/components/ui/card"
import type { OverviewStat } from "@/lib/types"

const ACCENTS: Record<string, string> = {
  total: "text-primary",
  safe: "text-safe",
  medium: "text-medium",
  high: "text-high",
  avg: "text-foreground",
}

function formatValue(stat: OverviewStat): string {
  if (stat.format === "score") return `${stat.value}`
  return formatNumber(stat.value)
}

export function StatCards({ stats }: { stats: OverviewStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {stats.map((stat) => {
        const positive = stat.change >= 0
        // For high-risk emails, an increase is "bad" (rendered in the high color).
        const goodTrend =
          stat.key === "high" || stat.key === "medium" || stat.key === "avg"
            ? !positive
            : positive
        return (
          <Card key={stat.key} className="gap-0 py-0">
            <CardContent className="flex flex-col gap-3 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div className="flex items-end justify-between gap-2">
                <span
                  className={cn(
                    "font-heading text-2xl font-semibold tabular-nums tracking-tight",
                    ACCENTS[stat.key],
                  )}
                >
                  {formatValue(stat)}
                  {stat.format === "score" && (
                    <span className="text-sm text-muted-foreground">/100</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    goodTrend ? "text-safe" : "text-high",
                  )}
                >
                  {positive ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
