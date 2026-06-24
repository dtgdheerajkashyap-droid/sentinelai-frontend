import { cn } from "@/lib/utils"
import { RISK_META, levelFromScore } from "@/lib/risk"

export function RiskGauge({
  score,
  size = 140,
  className,
}: {
  score: number
  size?: number
  className?: string
}) {
  const level = levelFromScore(score)
  const meta = RISK_META[level]
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={meta.chart}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-semibold tabular-nums", meta.text)}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">Risk score</span>
      </div>
    </div>
  )
}
